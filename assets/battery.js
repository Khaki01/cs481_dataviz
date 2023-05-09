// function batteryLogPhone(battery, score, mins) {
//   let chargeBox = battery.querySelector(".charge");
//   let percentageText = document.getElementById("phone-percentage-text");
//   let phoneHoursText = document.getElementById("phone-hours-text");
//   let hours = Math.floor(parseInt(mins) / 60);
//   let minutes = parseInt(mins) - hours * 60;
//   let parentHeight = parseInt(chargeBox.parentNode.offsetHeight);
//   let currHeight = parseInt(chargeBox.offsetHeight);
//   let newHeight = Math.round(
//     (currHeight / (parentHeight + 0.001) + score / 100) * 100
//   );
//   newHeight = newHeight < 100 ? newHeight : 100;
//   chargeBox.style.height = `${newHeight}%`;
//   percentageText.innerHTML = `${newHeight}%`;
//   phoneHoursText.innerHTML = `${hours} hours ${minutes} min`;

//   var res = percentageToHsl(newHeight / 100, 0, 120);
//   chargeBox.style.background = res;
// }

// function batteryLogActivity(
//   battery,
//   score,
//   totalCal,
//   runTime,
//   gymCal,
//   stepsCount
// ) {
//   let chargeBox = battery.querySelector(".charge-inner");
//   let percentageText = document.getElementById("activity-percentage-text");
//   let TotalCaloriesText = document.getElementById("total-calories-text");
//   let RunningText = document.getElementById("running-text");
//   let GymText = document.getElementById("gym-calories-text");
//   let StepsText = document.getElementById("steps-count-text");

//   let parentHeight = parseInt(chargeBox.parentNode.offsetHeight);
//   let currHeight = parseInt(chargeBox.offsetHeight);
//   let newHeight = Math.round(
//     (currHeight / (parentHeight + 0.001) + score / 100) * 100
//   );
//   newHeight = newHeight < 100 ? newHeight : 100;
//   chargeBox.style.height = `${newHeight}%`;
//   percentageText.innerHTML = `${newHeight}%`;
//   TotalCaloriesText.innerHTML = `${totalCal}/3000 kcal`;
//   RunningText.innerHTML = `${runTime} min`;
//   GymText.innerHTML = `${gymCal} kcal`;
//   StepsText.innerHTML = `${stepsCount}`;

//   var res = percentageToHsl(newHeight / 100, 0, 120);
//   chargeBox.style.background = res;
// }

// function percentageToHsl(percentage, hue0, hue1) {
//   var hue = percentage * (hue1 - hue0) + hue0;
//   return "hsl(" + hue + ", 100%, 50%)";
// }

// function createBattery(day, month, year) {
//   let batteryDiv = document.createElement("div");
//   batteryDiv.id = `battery${day}${month}${year}`;
//   batteryDiv.classList.add("battery-small");

//   let batteryHead = document.createElement("div");
//   batteryHead.classList.add("battery-head");

//   let batteryBody = document.createElement("div");
//   batteryBody.classList.add("battery-body");
//   batteryBody.id = "battery-head";

//   let chargeDiv = document.createElement("div");
//   chargeDiv.classList.add("charge");
//   chargeDiv.id = "charge";

//   let batterBodyInner = document.createElement("div");
//   batterBodyInner.classList.add("battery-body-inner");
//   batterBodyInner.id = "battery-body-inner";

//   let chargeDivInner = document.createElement("div");
//   chargeDivInner.classList.add("charge-inner");
//   chargeDivInner.id = "charge-inner";

//   batterBodyInner.appendChild(chargeDivInner);
//   batteryBody.appendChild(chargeDiv);
//   batteryBody.appendChild(batterBodyInner);
//   batteryDiv.appendChild(batteryHead);
//   batteryDiv.appendChild(batteryBody);
//   openDetailListener(batteryDiv);
//   return batteryDiv;
// }

// function openDetailListener(element) {
//   element.addEventListener("click", function () {
//     console.log(element.id);
//   });
// }
