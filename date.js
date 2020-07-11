var start = new Date("2020-07-01");
var end = new Date("2020-07-15");
var stringDate;
for (start; start <= end; start.setDate(start.getDate() + 1)) {
  var date = start.getDate();
  var month = start.getMonth() + 1;
  var year = start.getFullYear();
  var day = start.getDay() + 1;
  stringDate =
    (date < 10 ? "0" + date : date) +
    "/" +
    (month < 10 ? "0" + month : month) +
    "/" +
    year;
   if(day%2 == 0){
   } 
  if (day % 2 != 0 && day != 1) {
  }
}
var page = 16 / 5 ;
console.log(Math.ceil(page));