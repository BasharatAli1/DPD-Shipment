require('dotenv').config();
const ClientError = require('./app/errors/ClientError'),
	express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	morgan = require('morgan');

const http = require('http');
require('./app/lib/redis');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app', 'static')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '500mb',
	})
);

app.use(function (req, res, next) {
	res.jsend = function (body, err = null) {
		if (err) {
			if (err instanceof ClientError) {
				return res.json({
					status: 'fail',
					data: err,
				});
			} else {
				return res.json({
					status: 'error',
					message: err.message,
					code: err.code,
					data: err,
				});
			}
		} else {
			return res.json({
				status: 'success',
				data: body,
			});
		}
	};
	next();
});

app.use(morgan('dev'));

app.use(process.env.API_PREFIX, require('./app/routes/'));

const port = process.env.PORT || '3000';
const host = process.env.HOST || 'localhost';
const server = http.createServer(app);
server.listen(port, host, function (err) {
	console.log(`
>>  Listening for requests on http://${host}:${port}${process.env.API_PREFIX}
>>  Logging access requests locally
>>  Ready.
    `);
});
