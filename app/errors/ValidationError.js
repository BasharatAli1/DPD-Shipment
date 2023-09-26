function ClientError(code = 'validation_error', error = {}) {
	this.name = 'ValidationError';
	this.message = error.message || 'Validation Error';
	Error.call(this, error.message);
	Error.captureStackTrace(this, this.constructor);
	this.code = code;
	this.status = error.status || 400;
	this.inner = error;
}

ClientError.prototype = Object.create(Error.prototype);
ClientError.prototype.constructor = ClientError;

module.exports = ClientError;
