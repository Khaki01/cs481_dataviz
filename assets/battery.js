function batteryLog(battery, score) {
  //   console.log("succesfully accessed");

  let chargeBox = battery.querySelector(".battery-body .charge");
  //   console.log(chargeBox);
  let parentHeight = parseInt(chargeBox.parentNode.offsetHeight);
  let currHeight = parseInt(chargeBox.offsetHeight);
  //   let newHeight = currHeight +
  let newHeight = Math.round(
    (currHeight / (parentHeight + 0.001) + score / 100) * 100
  );
  // console.log(chargeBox.parentNode);
  newHeight = newHeight < 100 ? newHeight : 100;
  chargeBox.style.height = `${newHeight}%`;

  var res = percentageToHsl(newHeight / 100, 0, 120);
  chargeBox.style.background = res;
  //   let rgbArr = window
  //     .getComputedStyle(chargeBox)
  //     .backgroundColor.split("(")[1]
  //     .split(")")[0]
  //     .split(", ");
  //   console.log(rgbArr);
  //   let r = parseInt(rgbArr[0]);
  //   let g = parseInt(rgbArr[1]);
  //   let b = parseInt(rgbArr[2]);
  //   let hslArr = rgbToHsl(r, g, b);
}

function percentageToHsl(percentage, hue0, hue1) {
  var hue = percentage * (hue1 - hue0) + hue0;
  return "hsl(" + hue + ", 100%, 50%)";
}

function createBattery(day, month, year) {
  let batteryDiv = document.createElement("div");
  batteryDiv.id = `battery${day}${month}${year}`;
  batteryDiv.classList.add("battery-small");

  let batteryHead = document.createElement("div");
  batteryHead.classList.add("battery-head");

  let batteryBody = document.createElement("div");
  batteryBody.classList.add("battery-body");
  batteryBody.id = "battery-head";

  let chargeDiv = document.createElement("div");
  chargeDiv.classList.add("charge");
  chargeDiv.id = "charge";

  let batterBodyInner = document.createElement("div");
  batterBodyInner.classList.add("battery-body-inner");
  batterBodyInner.id = "battery-body-inner";

  let chargeDivInner = document.createElement("div");
  chargeDivInner.classList.add("charge-inner");
  chargeDivInner.id = "charge-inner";

  batterBodyInner.appendChild(chargeDivInner);
  batteryBody.appendChild(chargeDiv);
  batteryBody.appendChild(batterBodyInner);
  batteryDiv.appendChild(batteryHead);
  batteryDiv.appendChild(batteryBody);
  openDetailListener(batteryDiv);
  return batteryDiv;
}

function openDetailListener(element) {
  element.addEventListener("click", function () {
    console.log(element.id);
  });
}

// html.Div(
//         [
//             html.Div(
//                 [],
//                 className="battery-head",
//             ),
//             html.Div(
//                 [
//                     html.Div(
//                         [],
//                         id="charge",
//                         className="charge"
//                     ),
//                 ],
//                 id="battery-body",
//                 className="battery-body",
//             ),
//         ],
//         className="battery",
//         id="battery060523",
//     )
//  EXTRA

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

// convert a number to a color using hsl
function numberToColorHsl(i) {
  // as the function expects a value between 0 and 1, and red = 0° and green = 120°
  // we convert the input to the appropriate hue value
  var hue = (i * 1.2) / 360;
  // we convert hsl to rgb (saturation 100%, lightness 50%)
  var rgb = hslToRgb(hue, 1, 0.5);
  // we format to css value and return
  return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}
