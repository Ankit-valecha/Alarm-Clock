// Define your DOM element references outside the event handler
const currentTimeDisplay = document.getElementById("current-time");
const setAlarmList = document.getElementById("setAlarm-list");

// Function to display the current time in the UI
function updateCurrentTime() {
  const currentTimeDisplay = document.getElementById("current-time");
  if (currentTimeDisplay) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = now.getHours() < 12 ? "AM" : "PM";
    currentTimeDisplay.innerText = `${hours}:${minutes}:${seconds} ${ampm}`;
  } else {
    console.error("Element with id 'current-time' not found.");
  }
}

// Update current time every second
window.addEventListener("DOMContentLoaded", function () {
  setInterval(updateCurrentTime, 1000);
});

let alarmList = [];

// Function to set a new alarm
const setAlarm = () => {
  // Get values from input fields
  const hours = Number(document.querySelector("#setAlarm-hour").value);
  const mins = Number(document.querySelector("#setAlarm-min").value);
  const secs = Number(document.querySelector("#setAlarm-sec").value);
  const ampm = document.querySelector("#setAlarm-ampm").value;

  // Validate input
  if (isNaN(hours) || isNaN(mins) || isNaN(secs) || ampm === "AM/PM") {
    alert("Please enter a valid time.");
    return;
  }

  // Create a new alarm object
  const alarm = {
    id: Date.now(),
    hours,
    mins,
    secs,
    ampm,
    setime: null,
  };

  // Add the alarm to the list
  alarmList.push(alarm);

  // Display the alarm in the UI
  HandleDisplay(alarmList);

  // Calculate the time until the alarm rings
  const now = new Date();
  const alarmTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    mins,
    secs
  );
  let alarmRingTime = alarmTime - now;

  // If the alarm time is in the past, set it for the next day
  if (alarmRingTime <= 0) {
    alarmRingTime += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Set a timeout for the alarm
  alarm.setime = setTimeout(() => {
    alert(`Alarm! It's ${hours}:${mins}:${secs} ${ampm}.`);
  }, alarmRingTime);

  // Clear input fields
  document.querySelector("#setAlarm-hour").value = "";
  document.querySelector("#setAlarm-min").value = "";
  document.querySelector("#setAlarm-sec").value = "";
};

// Function to delete an alarm
function handleDelete(id) {
  // Find the alarm in the list
  const deleteAlarm = alarmList.find((alarm) => alarm.id === id);

  // Clear the timeout for the alarm
  clearTimeout(deleteAlarm.setime);

  // Remove the alarm from the list
  alarmList = alarmList.filter((alarm) => alarm.id !== id);

  // Update the UI
  HandleDisplay(alarmList);
}

// Function to display alarms in the UI
const HandleDisplay = (alarmList) => {
  setAlarmList.innerHTML = "";
  setAlarmList.innerHTML += alarmList.map((item) => {
    const { hours, mins, secs, id, ampm } = item;
    const hoursFormatted = hours.toString().padStart(2, "0");
    const minsFormatted = mins.toString().padStart(2, "0");
    const secsFormatted = secs.toString().padStart(2, "0");
    return `
      <div class="parent">
        <div class="current-time-alarm-left">
          <div class="current-time-alarm">${hoursFormatted}:${minsFormatted}:${secsFormatted} ${ampm}</div>
        </div>
        <div class="current-time-alarm-right">
          <button onclick="handleDelete(${id})">DELETE</button>
        </div>
      </div>
    `;
  }).join(""); // Join the array to avoid commas between elements
};
