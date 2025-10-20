const WIDTH = 1400;
const HEIGHT = 800;
let digitDisplays = []; // array of 6 digits_display instances
let lastSecond = -1;
let ampmDisplay = null; // digits_display instance for AM/PM (shows A or P)

// layout params (set in setup)
let digitStartX = 0;
let digitSpacing = 0;
let digitW = 0;
let digitH = 0;

// Patterns moved to digit_patterns.js
// Import them here so sketch remains modular. If running in the browser with modules enabled,
// you can use an import. For non-module environments, include digit_patterns.js before sketch.js
// and assign rotation/digits to the global scope.

// If using modules (ESM), uncomment the line below and ensure your environment supports imports.
// import { rotation, digits } from './digit_patterns.js';

// Temporary fallback: if digit_patterns.js isn't imported, ensure rotation/digits exist globally.
// Ensure digit_patterns.js is included before this file so `rotation` and `digits` are available.

function setup() {
  createCanvas(WIDTH, HEIGHT);

  // Create a HH:MM:SS display (6 digitDisplays)
  // Choose digit cell size based on canvas width
  digitW = Math.min(140, Math.floor(WIDTH / 8));
  digitH = Math.floor(digitW * 2);
  const gap = Math.floor(digitW * 0.25);
  digitSpacing = digitW + gap;
  // center entire block horizontally — include AM/PM as an extra slot so the whole block stays centered
  const totalSlots = 6 + 1; // 6 digits + 1 AM/PM
  digitStartX = WIDTH / 2 - ((totalSlots - 1) / 2) * digitSpacing;

  for (let i = 0; i < 6; i++) {
    const x = digitStartX + i * digitSpacing;
    const y = HEIGHT / 2;
    const dd = new digits_display(x, y, digitW, digitH, 0);
    digitDisplays.push(dd);
  }

  // Create a smaller digits_display to show A or P to indicate AM/PM
  // We'll size it relative to digitW so it fits to the right
  const ampmW = Math.floor(digitW * 0.9);
  const ampmH = Math.floor(digitH * 0.9);
  // place AM/PM in the slot after the 6th digit (slot index 6)
  const ampmX = digitStartX + 6 * digitSpacing; // center of the AM/PM slot
  const ampmY = HEIGHT / 2;
  ampmDisplay = new digits_display(ampmX, ampmY, ampmW, ampmH, 'A');

  // Initialize with current time
  updateClock();

  // OLD CODE (commented out - you can delete this if you want)
  // Create a 4x6 grid of clocks
  // const cols = 4;
  // const rows = 6;
  // const clockSize = 50;
  // const spacingX = WIDTH / (cols + 1);
  // const spacingY = HEIGHT / (rows + 1);

  // Create clocks row by row (top to bottom), then column by column (left to right)
  // for (let row = 0; row < rows; row++) {
  //   for (let col = 0; col < cols; col++) {
  //     let x = spacingX * (col + 1);
  //     let y = spacingY * (row + 1);
  //     clocks.push(new small_clock(x, y, clockSize, [135, 135]));
  //   }
  // }

  console.log("digits_display created");
}

function draw() {
  background(1);

  // Render all six digit displays
  for (let dd of digitDisplays) dd.render();

  // draw colons between HH:MM:SS (tiny circles)
  fill(255);
  noStroke();
  const colonY1 = HEIGHT / 2 - digitH * 0.25;
  const colonY2 = HEIGHT / 2 + digitH * 0.25;
  const colonX1 = digitStartX + digitSpacing * 1.5;
  const colonX2 = digitStartX + digitSpacing * 3.5;
  ellipse(colonX1, colonY1, digitW * 0.12);
  ellipse(colonX1, colonY2, digitW * 0.12);
  ellipse(colonX2, colonY1, digitW * 0.12);
  ellipse(colonX2, colonY2, digitW * 0.12);

  // Update once per second
  const now = new Date();
  const s = now.getSeconds();
  if (s !== lastSecond) {
    lastSecond = s;
    updateClock();
  }

  // Draw AM/PM indicator to the right of the last digit (AM/PM)
  const hours24 = now.getHours();
  const isPM = hours24 >= 12;
  // choose symbol 'P' for PM else 'A' for AM
  const ampmSymbol = isPM ? 'P' : 'A';
  // Position ampmDisplay to the right of the last digit but clamp to canvas
  let amX = digitStartX + 5 * digitSpacing + digitSpacing * 0.95;
  const amY = HEIGHT / 2;
  const amWidth = ampmDisplay ? ampmDisplay.w : Math.floor(digitW * 0.9);
  // clamp so it doesn't go off the right edge (leave 8px padding)
  if (amX + amWidth / 2 + 8 > WIDTH) {
    amX = WIDTH - (amWidth / 2) - 8;
  }
  if (ampmDisplay) {
    // update position and size in case of resize logic (recreate would be more robust)
    ampmDisplay.x = amX;
    ampmDisplay.y = amY;
    // set to A or P
    ampmDisplay.setDigit(ampmSymbol);
    ampmDisplay.render();
  }
}

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const isPM = h >= 12;
  // Convert to 12-hour clock, with 12 represented as 12 (not 0)
  h = h % 12;
  if (h === 0) h = 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const digitsArr = [
    Math.floor(h / 10), h % 10,
    Math.floor(m / 10), m % 10,
    Math.floor(s / 10), s % 10,
  ];

  for (let i = 0; i < 6; i++) {
    digitDisplays[i].setDigit(digitsArr[i]);
  }
}

// small_clock and digits_display have been moved into small_clock.js and digits_display.js
// Ensure those files are included via script tags in index.html before this sketch.
