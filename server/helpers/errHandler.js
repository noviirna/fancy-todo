module.exports = function(err, req, res, next) {
  console.log(err, "errHandler")
  console.log(JSON.parse(JSON.stringify(err, null, 4)), "errHandler");
  if (err.code) {
    res.status(err.code).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
};
