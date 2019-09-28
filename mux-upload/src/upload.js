const fs = require('fs')
const path = require('path')
const request = require('request')
const superagent = require('superagent')
const progressStream = require('progress-stream')
const log = require('single-line-log').stdout
const promiseSerial = require('promise-serial')
const dotenv = require('dotenv')
const inquirer = require('inquirer')

dotenv.config()

/* Just validates that they both exist and have lengths greater than 0 */
const validateCredentials = (credentials) => {
  if (!credentials) return false
  const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = credentials
  const arr = [MUX_TOKEN_ID, MUX_TOKEN_SECRET]
  if (arr.filter(Boolean).filter((t) => t.length).length < 2) return false
  return true
}

const homeDir = require('os').homedir()

const USER_CREDENTIALS_PATH =
  process.env.CREDENTIALS_PATH || path.resolve(homeDir, '.mux-credentials')

const promptCredentials = async () => {
  const input = await inquirer.prompt([
    {
      type: 'input',
      name: 'MUX_TOKEN_ID',
      message: 'What is your Mux Token ID?',
    },
    {
      type: 'input',
      name: 'MUX_TOKEN_SECRET',
      message: 'What is your Mux Token Secret?',
    },
  ])
  return {
    MUX_TOKEN_ID: input.MUX_TOKEN_ID.trim(),
    MUX_TOKEN_SECRET: input.MUX_TOKEN_SECRET.trim(),
  }
}

const saveCredentials = (credentials) => {
  fs.writeFileSync(
    USER_CREDENTIALS_PATH,
    `MUX_TOKEN_ID=${credentials.MUX_TOKEN_ID}\nMUX_TOKEN_SECRET=${credentials.MUX_TOKEN_SECRET}`,
  )
}

const getCredentials = async () => {
  const envCreds = dotenv.config({ path: path.resolve(process.cwd(), '.env') })
  if (
    envCreds.pared &&
    envCreds.parsed.MUX_TOKEN_ID &&
    envCreds.parsed.MUX_TOKEN_SECRET
  )
    return envCreds.parsed
  if (validateCredentials(envCreds)) return envCreds

  const userCreds = dotenv.config({ path: path.resolve(USER_CREDENTIALS_PATH) })

  if (userCreds && userCreds.parsed && validateCredentials(userCreds.parsed))
    return userCreds.parsed

  const inputCredentials = await promptCredentials()
  if (!validateCredentials(inputCredentials))
    throw new Error('MUX_TOKEN_ID and MUX_TOKEN_SECRET must both be provided')

  // get a test upload URL to make sure the tokens are valid

  const uploadUrl = await getUploadUrl(inputCredentials).catch((err) => {
    if (err.status === 401) {
      throw new Error(
        'Mux rejected these credentials. Please check your Token ID and secret and try again.',
      )
    }
  })

  /**
   * Save the variables
   */
  fs.writeFileSync(
    USER_CREDENTIALS_PATH,
    `MUX_TOKEN_ID=${inputCredentials.MUX_TOKEN_ID}\nMUX_TOKEN_SECRET=${inputCredentials.MUX_TOKEN_SECRET}`,
    { flag: 'w' },
  )

  return inputCredentials
}

const getUploadUrl = (credentials) =>
  new Promise((resolve, reject) => {
    if (
      !credentials ||
      !credentials.MUX_TOKEN_ID ||
      !credentials.MUX_TOKEN_SECRET
    ) {
      throw new Error('No credentials were provided')
    }
    superagent
      .post('https://api.mux.com/video/v1/uploads')
      .auth(credentials.MUX_TOKEN_ID, credentials.MUX_TOKEN_SECRET)
      .type('application/json')
      .send({
        new_asset_settings: {
          playback_policy: ['public'],
          per_title_encode: true,
          mp4_support: 'standard',
        },
      })
      .then((response) => {
        resolve(response.body.data.url)
      })
      .catch((err) => {
        reject(err)
      })
  })

const uploadFile = async (credentials, sourceFile) =>
  new Promise(async (resolve) => {
    const uploadUrl = await getUploadUrl(credentials)

    const fileSize = fs.statSync(sourceFile).size
    const stream = fs.createReadStream(sourceFile)
    let complete = 0

    // const pStream= progressStream({ time: 50, length: fileSize })
    //
    // pStream.on(
    //   'progress',
    //   (state) => {
    //     console.log(`Uploading ${sourceFile}: ${Math.floor(state.percentage)}%`)
    //   },
    // )

    stream
      .on('data', function(data) {
        complete += data.length
        var percentage = Math.floor((100 * complete) / fileSize)

        log(data.length)
        log(`Uploading ${sourceFile}: ${Math.floor(percentage)}%`)
      })
      .on('error', function(err) {
        console.error(err)
      })
      .on('end', () => {
        log(`Uploading ${sourceFile}: complete`)
        log.clear()
        resolve()
      })
      .pipe(request.put(uploadUrl))
  })

const init = async () => {
  const credentials = await getCredentials()
  const files = process.argv.slice(2)
  const uploads = files.map((file) => () => uploadFile(credentials, file))
  await promiseSerial(uploads)
}

init()
