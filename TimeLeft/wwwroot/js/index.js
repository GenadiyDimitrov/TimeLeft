//constants for work hours - change if needed
const startShift = 8;
const startLunch = 12;
const endLunch = 13;
const endShift = 17;

//constants
const oneHourMs = 3600000;
const oneMinMs = 60000;
const oneSecToMs = 1000;
const totalMs = (endShift - startShift) * oneHourMs; // 9 hours in milliseconds (08:00 - 17:00)

//elements
const clocksDiv = document.querySelector(".clocksDiv");
const messageBox = document.querySelector(".messageBox");

const titleText = document.getElementById("titleText");
const workMessage = document.getElementById("workMessage");

const timeBoxNow = document.getElementById("timeBoxNow");
const timeBoxLeft = document.getElementById("timeBoxLeft");
const timeBoxHours = document.getElementById("timeBoxHours");
const timeBoxMinutes = document.getElementById("timeBoxMinutes");
const timeBoxSeconds = document.getElementById("timeBoxSeconds");
const timeBoxMilliseconds = document.getElementById("timeBoxMilliseconds");


//messages - change automatically based on work hours, but the messages can be changed
const beforeWorkMessage = `The work hours are from ${String(startShift).padStart(2, "0")}:00 to ${String(endShift).padStart(2, "0")}:00\n` +
    "It's not yet time to work\n" +
    "Why come so early?\n" +
    "Relax. Sleep. Do other stuff....\n" +
    "Please keep your sanity!";
const lunchBreakMessage = `You have a lunch Break from ${String(startLunch).padStart(2, "0")}:00 to ${String(endLunch).padStart(2, "0")}:00\n` +
    "It's not yet time to work\n" +
    "Please keep yourself healty!\n" +
    "Relax. Eat something. Do other stuff....\n" +
    "Please keep your sanity!";
const afterWorkMessage = `The work hours are from ${String(startShift).padStart(2, "0")}:00 to ${String(endShift).padStart(2, "0")}:00\n` +
    "It's after hours!\n" +
    "Why are you still here?\n" +
    "Just stop and go HOME!\n" +
    "Please keep your sanity!";
const beforeWorkTitle = "Go away! Not yet time to start working!";
const beforeLunchTitle = `Welcome to "Wait until Lunch Time"`;
const lunchBreakTitle = "Go away! You must be relaxing!";
const beforeEndWorkTitle = `Welcome to "Wait until End of work day"`;
const afterWorkTitle = "Go away! You must be home by now!";


//variables for debug
let hourIndex = 0;
let minIndex = 0;
function getTime() {
    let now = new Date();
    if (window.DEBUG_MODE) {
        if (hourIndex < startShift || hourIndex >= endShift) {
            minIndex = 0;
            hourIndex += 1;
            if (hourIndex >= 24) { hourIndex = 0; }

            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourIndex, minIndex, 0);
        }

        minIndex += 20;
        if (minIndex >= 60) {
            minIndex = 0;
            hourIndex += 1;
        }

        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourIndex, minIndex, 0);
    }

    return now;
}

function timerTick() {
    let now = getTime();

    //set current time
    setCurrentTime(now);

    //full percents
    updateColor(now, totalMs);

    //"Before work";
    if (checkNotWorkingHours(startShift, now, beforeWorkMessage, beforeWorkTitle)) {
        return;
    }
    //"Before Lunch";
    if (checkWorkingHours(startLunch, now, beforeLunchTitle)) {
        return;
    }
    //"Lunch Time";
    if (checkNotWorkingHours(endLunch, now, lunchBreakMessage,)) {
        return;
    }
    //Before end of work
    if (checkWorkingHours(endShift, now, beforeEndWorkTitle)) {
        return;
    }
    //"After Work";
    changeVisibility("none", "flex");
    updateText(afterWorkMessage, afterWorkTitle);
}
function setCurrentTime(now) {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(2);
    timeBoxNow.innerText = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
function updateColor(now, totalMs) {
    let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endShift, 0, 0);
    let timeLeft = endTime - now;
    let percentRemain = timeLeft / totalMs; // Normalize between 0 and 1
    if (percentRemain < 0) percentRemain = 0;
    else if (percentRemain > 1) percentRemain = 1;
    let percent = 1 - percentRemain;
    const r = Math.round(255 * percentRemain); // Red decreases
    const g = Math.round(255 * percent); // Green increases
    const color = `rgb(${r}, ${g}, 0)`; // Convert to RGB format

    document.documentElement.style.setProperty('--progress-percent', `${percent * 100}%`);
    document.documentElement.style.setProperty('--time-index', color);
    document.querySelector(".progress-text").textContent = `${(percent * 100).toFixed(1)}%`;
}
function checkNotWorkingHours(shift, now, extraText, title) {
    if (new Date(now.getFullYear(), now.getMonth(), now.getDate(), shift, 0, 0) > now) {
        changeVisibility("none", "flex");
        updateText(extraText, title);
        return true;
    }
    return false;
}
function checkWorkingHours(shift, now, title) {
    let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), shift, 0, 0);
    if (endTime > now) {
        changeVisibility("flex", "none");
        updateTime(endTime - now);
        updateText("", title);
        return true;
    }
    return false;
}
function changeVisibility(main, msg) {
    clocksDiv.style.display = main; // Hide clocksDiv
    messageBox.style.display = msg; // Hide messagebox
}
function updateText(extraText, title) {
    workMessage.innerText = extraText;
    titleText.innerText = title;
}
function updateTime(timeLeft) {
    const timeLeftHours = String(Math.floor(timeLeft / oneHourMs)).padStart(2, "0");
    const timeLeftMinutes = String(Math.floor((timeLeft % oneHourMs) / oneMinMs)).padStart(2, "0");
    const timeLeftSeconds = String(Math.floor((timeLeft % oneMinMs) / oneSecToMs)).padStart(2, "0");
    timeBoxLeft.innerText = `${timeLeftHours}h ${timeLeftMinutes}m ${timeLeftSeconds}s`;

    timeBoxHours.innerText = String((timeLeft / oneHourMs).toFixed(0));
    timeBoxMinutes.innerText = String((timeLeft / oneMinMs).toFixed(0));
    timeBoxSeconds.innerText = String((timeLeft / oneSecToMs).toFixed(0));
    timeBoxMilliseconds.innerText = String(timeLeft);
}

setInterval(timerTick, 1000);

// Initialize time on page load
document.addEventListener("DOMContentLoaded", timerTick);