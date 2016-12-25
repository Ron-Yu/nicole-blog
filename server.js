import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import webpack from 'webpack'
import {devMiddleware, hotMiddleware} from 'koa-webpack-middleware'
import combinedRouters from './server/routes'
import webpackConfig from './webpack.config'

// eslint-disable-next-line import/no-unassigned-import
import './server/config/config'

// eslint-disable-next-line no-unused-vars
const {mongoose} = require('./server/db/mongoose')

const compiler = webpack(webpackConfig)

const port = process.env.PORT || 3000

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(serve('.'))
app.use(combinedRouters)

app.use(devMiddleware(compiler), {
	noInfo: false,
	publicPath: webpackConfig.output.publicPath
})
app.use(hotMiddleware(compiler))

app.listen(port)
