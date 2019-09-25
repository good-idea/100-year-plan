const fs = require('fs')
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

const USER_CREDENTIALS_PATH =
  process.env.CREDENTIALS_PATH || '~/.mux-credentials'

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
  return input
}

const saveCredentials = (credentials) => {
  fs.writeFileSync(
    USER_CREDENTIALS_PATH,
    `MUX_TOKEN_ID=${credentials.MUX_TOKEN_ID}\nMUX_TOKEN_SECRET=${credentials.MUX_TOKEN_SECRET}`,
  )
}

const getCredentials = async () => {
  const envCreds = dotenv.config({ path: path.resolve(process.cwd(), '.env') })
  if (envCreds.parsed.MUX_TOKEN_ID && envCreds.parsed.MUX_TOKEN_SECRET)
    return envCreds.parsed
  if (validateCredentials(envCreds)) return envCreds

  const userCreds = dotenv.config({ path: path.resolve(USER_CREDENTIALS_PATH) })
}

dotenv.config()

const getUploadUrl = () =>
  new Promise(async (resolve, reject) => {
    // const credentials = await getCredentials()
    const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env
    superagent
      .post('https://api.mux.com/video/v1/uploads')
      .auth(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)
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
        console.log(err)
        reject()
      })
  })

const uploadFile = async (sourceFile) =>
  new Promise(async (resolve) => {
    const uploadUrl = await getUploadUrl()

    const fileSize = fs.statSync(sourceFile).size
    const stream = fs.createReadStream(sourceFile)

    const progress = progressStream({ time: 50, length: fileSize }).on(
      'progress',
      (state) => {
        log(`Uploading ${sourceFile}: ${Math.floor(state.percentage)}%`)
      },
    )

    stream
      .pipe(progress)
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
  const files = process.argv.slice(2)
  const uploads = files.map((file) => () => uploadFile(file))
  await promiseSerial(uploads)
}

init()
