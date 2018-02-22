function ServerError(message) {
  this.message = message;
  Error.captureStackTrace(this, ServerError);
}

ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.name = ServerError.name;
ServerError.prototype.constructor = ServerError;

module.exports.ServerError = {
  ServerError,
};
