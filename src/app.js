import * as http from 'http'
import Koa from 'koa'
import Debug from 'debug'
import logger from 'koa-logger'
import config from './config'
import api from './routes'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import Router from 'koa-router'

const app = new Koa();
const log = Debug('app.js:log');
const logerr = Debug('app.js:error');
const router = new Router();

app.proxy = true;

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.status || 400;
		let message = err.message;
		if (err.name == "UnauthorizedError") {
			message = "Login Expired";
		}
		ctx.body = {
			status: false,
			message: message,
			errorCode: err.errorCode || err.status || err.code || 400
		};
		ctx.app.emit('error', err, ctx);
	}
});

app.use(cors({
	origin: '*',
	exposeHeaders: [''],
	maxAge: 5,
	credentials: true,
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['DNT', 'User-Agent', 'X-Requested-With', 'If-Modified-Since', 'Cache-Control', 'Content-Type', 'Authorization', 'Accept'],
}));

app.use(logger());
app.use(bodyParser());

app.use(api.routes());
app.use(api.allowedMethods());

app.on('error', (err, ctx) => {
	logerr('onerr ', err);
});

app.on('AppError', (err, ctx) => {
	console.log("logging AppError error", err);
});

log('service port %s', config.port);
http.createServer(app.callback()).listen(config.port);