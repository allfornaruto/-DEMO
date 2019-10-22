function savedb() {
  var data = {};
  var s3 = new s3();
  return s3.save(data);
}