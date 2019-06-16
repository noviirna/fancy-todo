const serverURL = "http://localhost:3000";
$("a").click(function(event) {
  event.preventDefault();
});

$("button").click(function(event) {
  event.preventDefault();
});

$("form").on("submit", function(event) {
  event.preventDefault();
});

$(document).ready(function() {
  checkLogin();
  $('select').selectpicker();
});

function checkLogin() {
  if (localStorage.getItem("token")) {
    loadprojectpage();
  } else {
    loadloginpage();
  }
}

function loadGAPI() {
  gapi.load("auth2", function() {
    gapi.auth2.init();
  });
}


function getTomorrowDate(){
  var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  var day = currentDate.getDate()
  var month = currentDate.getMonth() + 1
  var year = currentDate.getFullYear()

  if(String(month).length == 1){
    month = "0" + month.toString()
  }
  if(String(day).length == 1){
    day = "0" + day.toString()
  }
  let str = `${year}-${month}-${day}`

  return str
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

var reminder = [];
var todos = [];
var projects = [];
var users = [];
var loggedInUser = {};
