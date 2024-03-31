const currentTime = document.querySelector('#current-time span');
const setHours = document.querySelector('#hours');
const setMinutes = document.querySelector('#minutes');
const setSeconds = document.querySelector('#seconds');
const setAmPm = document.querySelector('#am-pm');
const submit = document.querySelector('#submit-btn');
const alertTune = new Audio('./media/ringtone.mp3');
const stopAlarmButton = document.querySelector('#stop-alarm button');
const alarmLists = document.querySelector('#alarms-list');

let alarms = [];

// Get the current date
const currentDate = new Date();

// Array of week days and months
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Get the week day, month, day, and year
const weekDay = weekDays[currentDate.getDay()];
const month = months[currentDate.getMonth()];
const day = currentDate.getDate();
const year = currentDate.getFullYear();

// Update the HTML elements with the values
document.getElementById('week').textContent = weekDay + ",";
document.getElementById('month').textContent = month;
document.getElementById('day').textContent = day + ",";
document.getElementById('year').textContent = year;


// to get current time

function getCurrentTime() {
    let time = new Date();
    time = time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    currentTime.innerHTML = time;
  
    return time;
  }

  // function updateClock() {
  //   let now = new Date();
  //   let hours = now.getHours();
  //   let minutes = now.getMinutes();
  //   let seconds = now.getSeconds();
  
  //   let timeString = hours.toString().padStart(2, '0') + ':'
  //     + minutes.toString().padStart(2, '0') + ':'
  //     + seconds.toString().padStart(2, '0');
  
  // }

  // handleInput from user

  function handleInput(e) {
    e.preventDefault();
    const hourValue = parseInt(setHours.value);
    const minuteValue = setMinutes.value;
    const secondValue = setSeconds.value;
    const amPmValue = setAmPm.value;
  
    const alarmTime = convertToTime(
      hourValue,
      minuteValue,
      secondValue,
      amPmValue
    );
    setAlarm(alarmTime);
  }

  function convertToTime(hour, minute, second, amPm) {
    return `${hour}:${minute}:${second} ${amPm}`;
  }

  //to add options interms of hours, minutes, second to select tag
  function dropDownMenu(start, end, element) {
    for (let i = start; i <= end; i++) {
      const dropDown = document.createElement("option");
      dropDown.value = i < 10 ? "0" + i : i;
      dropDown.innerHTML = i < 10 ? "0" + i : i;
      element.append(dropDown);
    }
  }

  function setAlarm(alarmTime, fetching = false){

    const interval = setInterval(() => {
      if(alarmTime === getCurrentTime()){
        alert("Alarm is Ringing....");
        alertTune.play();
      }
    }, 500);

    addAlarmsToDom(alarmTime, interval);
    if (!fetching) {
      saveAlarm(alarmTime);
    }
  }

  function stopAlarm() {
    alertTune.pause();
    
  }

  // save alarm to local storage
function saveAlarm(alarmTime) {
  const comingAlarms = checkAlarms();

  comingAlarms.push(alarmTime);
  localStorage.setItem("alarms", JSON.stringify(comingAlarms));
}

  // taking the help of localStorage to store all the alarms
  //to fetch the alarms that was previously set

  function checkAlarms() {
    // let alarms = [];
    const areAlarms = localStorage.getItem("alarms");
    if (areAlarms) alarms = JSON.parse(areAlarms);

    return alarms;
  }
  
  // Fetching alarms from local storage
  function fetchAlarm() {
    const alarms = checkAlarms();

    alarms.forEach((alarmTime) => {
      setAlarm(alarmTime, true);
    });
  }

  //adding alarms to the alarms list container
  function addAlarmsToDom(alarmTime, intervalId){
    // console.log(alarmTime);
    const alarm = document.createElement("div");
    alarm.classList.add("set-alarm", "mtbottom");
    alarm.innerHTML = `
              <div class="time">${alarmTime}</div>
              <button class=" btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
    const deleteButton = alarm.querySelector(".delete-alarm");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e, alarmTime, intervalId));

    alarmLists.append(alarm);
  }

  //delete the alarm from alarmsList
  function deleteAlarm(event, alarmTime, intervalId) {
    console.log(event.target);
    const {target} = event;
  
    clearInterval(intervalId);
  
    const parentDiv = target.parentElement;
    console.log(parentDiv);
    console.log(alarmTime);
  
    deleteAlarmFromLocal(alarmTime);
    parentDiv.remove();
  }

  //delete the alarm from localstorage as well
  function deleteAlarmFromLocal(time) {
    const alarms = checkAlarms();
  
    const index = alarms.indexOf(time);
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }


  //domcontentloaded event triggers
  //add hours, minutes, seconds to the dropdown menu
  window.addEventListener("DOMContentLoaded", (event) => {
  
    dropDownMenu(1, 12, setHours);
 
    dropDownMenu(0, 59, setMinutes);

    dropDownMenu(0, 59, setSeconds);

    setInterval(getCurrentTime, 1000);
    fetchAlarm();
  });

  //click event after user click on submit button from form tag
  submit.addEventListener("click", handleInput);
  
  //click event after user click on stop alarm button
  stopAlarmButton.addEventListener("click", stopAlarm);


  