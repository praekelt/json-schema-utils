class ValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
  }
}


module.exports = {
  ValidationError
};
