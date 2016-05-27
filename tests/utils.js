function captureError(fn) {
  try {
    fn();
  }
  catch (e) {
    return e;
  }

  return null;
}


module.exports = {
  captureError
};
