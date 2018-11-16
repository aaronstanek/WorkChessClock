function el(n) {
  return document.getElementById(n);
}

function jsEnabled() {
  el("pg1").style.display = "none";
  el("pg2").style.display = "inline";
}

window.onload = jsEnabled;

function setMessage() {
  if (Mode == "pause") {
    el("message").innerHTML = "The clock is paused.";
    return;
  }
  if (Mode == "work") {
    el("message").innerHTML = "You are working. You earn a minute of break-time for every " + Ratio.toString() + " minute(s) you work.";
  }
  else {
    el("message").innerHTML = "You are on break.";
  }
}

function setTime() {
  var cv = parseInt(ClockValue);
  var sign = 1;
  if (cv < 0) {
    sign = -1;
  }
  cv *= sign;
  var y;
  var hold;
  hold = (cv%60).toString();
  if (hold.length == 1) {
    hold = "0" + hold;
  }
  cv = parseInt(cv/60);
  y = (cv%60).toString();
  if (y.length == 1) {
    y = "0" + y;
  }
  hold = y + ":" + hold;
  cv = parseInt(cv/60);
  y = cv.toString();
  if (y.length == 1) {
    y = "0" + y;
  }
  hold = y + ":" + hold;
  if (sign == -1) {
    hold = "-" + hold;
    el("clock").style.color = "red";
  }
  else {
    el("clock").style.color = "black";
  }
  el("clock").innerHTML = hold;
}

function doTheReset() {
  el("in1").value = Ratio.toString();
  el("in2").value = (ClockValue/60.0).toString();
  el("pg3").style.display = "none";
  el("pg2").style.display = "inline";
}

function update() {
  var now = (new Date()).getTime();
  var last = LastUpdateTime;
  LastUpdateTime = now;
  if (UserPress != "none") {
    if (UserPress == "reset") {
      doTheReset();
      return;
    }
    Mode = UserPress;
    UserPress = "none";
  }
  if (Mode == "pause") {
    setMessage();
    setTimeout(update,Delay);
    return;
  }
  var diff = now - last;
  if (Mode == "break") {
    ClockValue -= (diff / 1000.0);
  }
  else {
    ClockValue += ((diff / Ratio) / 1000.0);
  }
  setMessage();
  setTime();
  setTimeout(update,Delay);
}

function startClock() {
  var ratio = parseFloat(el("in1").value);
  var clockValue = parseFloat(el("in2").value) * 60.0;
  if (isNaN(ratio) || isNaN(clockValue)) {
    alert("At least one of the values you entered is not valid.");
    return;
  }
  if (ratio <= 0) {
    alert("The number of minutes of work to earn a minute of break-time must be greater than zero.");
    return;
  }
  Ratio = ratio;
  ClockValue = clockValue;
  Mode = "pause";
  LastUpdateTime = (new Date()).getTime();
  UserPress = "none";
  Delay = 250;
  el("pg2").style.display = "none";
  el("pg3").style.display = "inline";
  setTime();
  setTimeout(update,1);
}

function pauseClock() {
  UserPress = "pause";
}

function workClock() {
  UserPress = "work";
}

function breakClock() {
  UserPress = "break";
}

function reset() {
  UserPress = "reset";
}
