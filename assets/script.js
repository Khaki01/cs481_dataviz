window.addEventListener("load", function () {
  // f();
  var key = 0;
  var date = new Date();
  var today = date.getDate();
  let battery = document.getElementById("battery06052023");
  //   click handler
  var rightBtn = document.getElementsByClassName("right-button")[0];
  var leftBtn = document.getElementsByClassName("left-button")[0];
  var monthBox = document.getElementsByClassName("month");
  var addBtn = this.document.getElementById("add-button");
  rightBtn.addEventListener("click", () => {
    next_year(date);
  });
  leftBtn.addEventListener("click", () => {
    prev_year(date);
  });
  for (var i = 0; i < monthBox.length; i++) {
    monthBox[i].addEventListener("click", (e) => {
      month_click(e, date, i);
    });
  }
  // addBtn.addEventListener("click", toggleFunction);
  // useFetch("http://localhost:8050");
  // fetch("http://localhost:8050/dataset/dataPhone.json")
  //   .then((response) => response.json())
  //   .then((json) => {
  //     const interval = setInterval(function () {
  //       // method to be executed;
  //       batteryLog(battery, scores[key]);
  //       if (key < scores.length) key++;
  //       else key = 0;
  //     }, 3000);

  //     clearInterval(interval);
  //     console.log(json);
  //   });
  // function toggleFunction() {
  //   if (key < scores.length) key++;
  //   else key = 0;
  //   batteryLog(battery, scores[key]);
  // }
  init_calendar(date);
});

function init_calendar(date) {
  var tbodyBox = document.getElementsByClassName("tbody")[0];
  while (tbodyBox.lastChild) {
    tbodyBox.removeChild(tbodyBox.lastChild);
  }
  //   $(".tbody").empty();
  var eventsContainer = document.getElementsByClassName("events-container")[0];
  while (eventsContainer.lastChild) {
    eventsContainer.removeChild(eventsContainer.lastChild);
  }
  //   $(".events-container").empty();
  var calendar_days = tbodyBox;
  var month = date.getMonth();
  var year = date.getFullYear();
  var day_count = days_in_month(month, year);
  var row = document.createElement("tr");
  row.classList.add("table-row");
  //   var row = $("<tr class='table-row'></tr>");
  var today = date.getDate();
  // Set date to 1 to find the first day of the month
  date.setDate(1);
  var first_day = date.getDay();
  // 35+firstDay is the number of date elements to be added to the dates table
  // 35 is from (7 days in a week) * (up to 5 rows of dates in a month)
  for (var i = 0; i < 35 + first_day; i++) {
    // Since some of the elements will be blank,
    // need to calculate actual date from index
    var day = i - first_day + 1;
    // If it is a sunday, make a new row
    if (i % 7 === 0) {
      calendar_days.append(row);
      row = document.createElement("tr");
      row.classList.add("table-row");
      //   row = $("<tr class='table-row'></tr>");
    }
    // if current index isn't a day in this month, make it blank
    if (i < first_day || day > day_count) {
      var curr_date = document.createElement("td");
      curr_date.classList.add("table-date", "nil");
      //   var curr_date = $("<td class='table-date nil'>" + "</td>");
      row.append(curr_date);
    } else {
      var curr_date = document.createElement("td");
      curr_date.classList.add("table-date", "nil");
      // var dayBattery = document.createElement("div");
      // console.log();
      var dayBattery = createBattery(day, month, year);
      // dayBattery.innerHTML = "asdf";
      curr_date.innerHTML = day;
      curr_date.appendChild(dayBattery);
      batteryLog(dayBattery, 10);

      //   var curr_date = $("<td class='table-date'>" + day + "</td>");
      //   var events = check_events(day, month + 1, year);
      var activeDate = document.getElementsByClassName("active-date");
      if (today === day && !activeDate) {
        curr_date.addClass("active-date");
        // show_events(events, months[month], day);
      }
      // If this date has any events, style it with .event-date
      //   if (events.length !== 0) {
      //     curr_date.addClass("event-date");
      //   }
      // Set onClick handler for clicking a date
      //   curr_date.click(
      //     { events: events, month: months[month], day: day },
      //     date_click
      //   );
      row.append(curr_date);
    }
  }
  // Append the last row and set the current year
  calendar_days.append(row);
  var yearBox = document.getElementsByClassName("year")[0];
  yearBox.innerHTML = year;
  //   $(".year").text(year);
}

function days_in_month(month, year) {
  var monthStart = new Date(year, month, 1);
  var monthEnd = new Date(year, month + 1, 1);
  return (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
}

// Event handler for when a month is clicked
function month_click(event, date, index) {
  var eventsContainer = document.getElementsByClassName("events-container")[0];
  eventsContainer.style.display = "block";
  //   $(".events-container").show(250);
  var dialogBox = document.getElementById("dialog");
  dialogBox.style.display = "none";
  var date = date;
  var activeMonth = document.getElementsByClassName("active-month")[0];
  // console.log(document.getElementsByClassName("active-month"));
  if (activeMonth) activeMonth.classList.remove("active-month");
  event.target.classList.add("active-month");
  //   $(this).addClass("active-month");
  //   var new_month = $(".month").index(this);
  index = indexInParent(event.target);
  date.setMonth(index);
  init_calendar(date);
}

// Event handler for when the year right-button is clicked
function next_year(date) {
  // console.log("CLICKED NEXT YEAR");
  var dialogBox = document.getElementById("dialog");
  dialogBox.style.display = "none";
  var date = date;
  var new_year = date.getFullYear() + 1;
  var yearBox = document.getElementsByClassName("year")[0];
  yearBox.innerHTML = new_year;
  date.setFullYear(new_year);
  init_calendar(date);
}

// Event handler for when the year left-button is clicked
function prev_year(date) {
  var dialogBox = document.getElementById("dialog");
  dialogBox.style.display = "none";
  //   setTimeout(() => {
  //     // 👇️ removes element from DOM
  //     dialogBox.style.display = "block";
  //   }, 250);
  var date = date;
  var new_year = date.getFullYear() - 1;
  var yearBox = document.getElementsByClassName("year")[0];
  yearBox.innerHTML = new_year;
  date.setFullYear(new_year);
  init_calendar(date);
}

var scores = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function indexInParent(node) {
  var children = node.parentNode.childNodes;
  var num = 0;
  for (var i = 0; i < children.length; i++) {
    if (children[i] == node) return num;
    if (children[i].nodeType == 1) num++;
  }
  return -1;
}

window.dash_clientside = Object.assign({}, window.dash_clientside, {
  clientside: {
    large_params_function: function (n_clicks, style) {
      return someTransform(n_clicks, style);
    },
  },
});

function someTransform(clicks, data) {
  let battery = document.getElementById("battery06052023");
  console.log(Object.keys(data).length);
  var key = 0;
  const interval = setInterval(function () {
    // method to be executed;
    console.log(data[key]["score"]);
    batteryLog(battery, data[key]["score"]);
    if (key + 1 < Object.keys(data).length) key++;
    else key = 0;
  }, 3000);

  // interval();
  // clearInterval(interval);

  return "HI";
}
