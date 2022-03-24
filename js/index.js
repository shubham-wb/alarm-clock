// Load Clock and check for Alarms
const domLoader = window.addEventListener("DOMContentLoaded", (event) => {
  startTime();
  DropDownMenu();
  checkAlarm();
  addListToDOM();
});

// declare variables
const audio = document.getElementById("audio"); //audio element of alarm
sethour = document.getElementById("setHour"); //variable to store  Hour
setMinutes = document.getElementById("setMinutes"); //variable to store Minute
setampm = document.getElementById("setampm"); //variable to store the Second
let btn = document.getElementById("btn"); //button to add the alarm to list
let timerList = document.getElementById("alarms-list"); //alarm list

// function to start the clock
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  let ampm = checkampm(h);

  if (h > 12) {
    h = h - 12;
  }

  if (h < 10) {
    h = "0" + h; //add zero to hour  ;
  }

  m = addZero(m);
  s = addZero(s);

  document.getElementById("hour").innerHTML = h;
  document.getElementById("minutes").innerHTML = m;
  document.getElementById("seconds").innerHTML = s;
  document.getElementById("ampm").innerHTML = ampm;
  setTimeout(startTime, 1000);
}

// function to add zeroes if value is less than 12 ..
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  } // add zero in front of numbers < 10
  return i;
}

// function to check for AM or PM ..
function checkampm(i) {
  if (i > 11) {
    return "PM";
  } else {
    return "AM";
  }
}

//function  to get current time ....
function getCurrentTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();

  s = addZero(s);
  m = addZero(m);
  h = addZero(h);

  return h + "" + m + "" + s;
}

//function to add options in select menu
function DropDownMenu() {
  //add option in hour

  for (i = 1; i <= 12; i++) {
    if (i < 10) {
      i = "0" + i;
    }
    let option = document.createElement("option");
    option.innerText = i;
    sethour.append(option);
  }

  //  add options in minutes

  for (i = 0; i <= 59; i++) {
    if (i < 10) {
      i = "0" + i;
    }

    let option = document.createElement("option");
    option.innerText = i;

    setMinutes.append(option);
  }
}

//on clicking add button
btn.addEventListener("click", (e) => {
  var options_hr = sethour.options[sethour.selectedIndex].value;
  var options_mins = setMinutes.options[setMinutes.selectedIndex].value;
  var options_ampm = setampm.options[setampm.selectedIndex].value;

  if (options_ampm == "PM" && options_hr != 12) {
    options_hr = +options_hr + 12;
  } else if (options_ampm == "AM" && options_hr == 12) {
    options_hr = "00";
  }

  var selected_time = options_hr + "" + options_mins + "00";
  console.log(selected_time);
  saveAlarm(selected_time);
});

//add alarm to alarms list in DOM
function addListToDOM() {
  const alarms = getAlarms();
  alarms.forEach((alarm) => {
    var timerListItem = document.createElement("li");

    if (alarm.substring(0, 2) == "12") {
      showampm = "PM";
      temp = 12;
    } else if (alarm.substring(0, 2) == "00") {
      showampm = "AM";
      temp = 12;
    } else if (alarm.substring(0, 2) > "12") {
      temp = alarm.substring(0, 2) - 12;
      temp = "0" + temp;
      showampm = "PM";
    } else {
      temp = alarm.substring(0, 2);
      showampm = "AM";
    }

    timerListItem.innerHTML = `<span>${temp} : ${alarm.substring(
      2,
      4
    )} ${showampm}</span><button id = "del-btn" data-id =${alarm}>Delete</button>`;
    timerList.prepend(timerListItem);

    let delbtn = document.getElementById("del-btn");

    delbtn.addEventListener("click", () => {
      deletefromStorage(alarm);
      location.reload();
    });
  });
}

// function to get alarms , present in the local storage
function getAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) {
    alarms = JSON.parse(isPresent);
  }
  return alarms;
}

// function to save alarm in local storage
function saveAlarm(time) {
  const alarms = getAlarms();
  let isPresentAlready = alarms.indexOf(time);

  if (isPresentAlready == -1) {
    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }
}

// function to compare current time with alarm list
function checkAlarm() {
  const alarms = getAlarms();
  currentTime = getCurrentTime();
  alarms.forEach((time) => {
    if (time === currentTime) {
      audio.play();
      alert("Alarm Ringing");
      audio.pause();
    }
  });
  setTimeout(checkAlarm, 1000);
}

// function to delete alarm from local Storage
function deletefromStorage(alarm) {
  const alarms = getAlarms();
  if (alarms.indexOf(alarm) != -1) {
    alarms.splice(alarms.indexOf(alarm), 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }
}
