/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
require('dotenv').config()
const CopyPlugin = require('copy-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const sanityClient = require('@sanity/client')

/**
 * Get site data from Sanity
 */

const query = `
*[_type == 'website' && domain == $siteId][0]{
  name,
  domain,
  seo {
    description,
    image{
      asset->{
        url
      },
    },
  },
}
`

const client = sanityClient({
  projectId: 'ddpo9nmo',
  dataset: 'production',
  useCdn: false,
})

const getSiteData = (siteId) => {
  console.log('fetching', siteId)

  return client.fetch(query, { siteId })
}

/**
 * Config Settings
 */

const PATHS = {
  root: path.resolve(__dirname),
  nodeModules: path.resolve(__dirname, 'node_modules'),
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'build'),
  js: 'static/js',
}

const DEV_SERVER = {
  hot: true,
  hotOnly: true,
  historyApiFallback: true,
  overlay: true,
  contentBase: path.resolve(__dirname, 'public'),
}

class MyPlugin {
  constructor(options) {
    this.siteId = options.siteId
    this.env = options.env
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          console.log('DATA')
          console.log(data)
          if (
            this.env === 'production' &&
            this.siteId !== '100yearplan.world'
          ) {
            data.assets.js = data.assets.js.map(
              (name) => `https://www.100yearplan.world${name}`,
            )
          }
          // Tell webpack to move on
          cb(null, data)
        },
      )
    })
  }
}

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = async (env) => {
  console.log(env)
  if (!process.env.SITE_ID) throw new Error('You must provide a SITE_ID')
  const siteConfig = await getSiteData(process.env.SITE_ID)
  if (!siteConfig.domain) throw new Error('No site data was found')
  const siteId = siteConfig.domain
  const siteTitle = siteConfig.name

  await sleep(3000)
  const isDev = env !== 'production'
  return {
    mode: isDev ? 'development' : 'production',
    cache: isDev,
    devtool: 'source-map',
    devServer: isDev ? DEV_SERVER : {},
    context: PATHS.root,
    entry: isDev ? ['./src/index.tsx'] : './src/index.tsx',
    output: {
      path: PATHS.dist,
      filename: isDev
        ? `${PATHS.js}/[name].js`
        : `${PATHS.js}/[name].[hash].js`,
      publicPath: '/',
    },
    resolve: {
      symlinks: true,
      extensions: ['.mjs', '.ts', '.tsx', '.js'],
      alias: isDev
        ? {
            'react-dom': '@hot-loader/react-dom',
          }
        : {},
    },
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          include: PATHS.src,
        },
      ],
    },
    plugins: [
      new CheckerPlugin(),
      // isDev ? new HardSourceWebpackPlugin() : null,
      new webpack.DefinePlugin({
        'process.env.DEV': JSON.stringify(isDev),
      }),
      new HtmlWebpackPlugin({
        templateParameters: {
          siteTitle,
          siteId,
        },
      }),
      new MyPlugin({ env, siteId }),
      // new HtmlWebpackPlugin({
      //   template: './public/index.html',
      // }),
      // isDev && new webpack.HotModuleReplacementPlugin(),
      isDev && new webpack.NamedModulesPlugin(),
      !isDev &&
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
        }),
      !isDev && new CopyPlugin([{ from: './public/' }]),
    ].filter(Boolean),
    optimization: {
      minimize: !isDev,
      splitChunks: {
        name: true,
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            filename: isDev
              ? `${PATHS.js}/vendor.[hash].js`
              : `${PATHS.js}/vendor.[contentHash].js`,
            priority: -10,
          },
        },
      },
      runtimeChunk: true,
    },
  }
}
