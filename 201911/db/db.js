function savedbv2() {
  var data = {};
  var o = {};
  data.o = o;
  var s3 = new s3();
  return s3.save(data);
}