const WIDTH = 1400;
const HEIGHT = 800;
let digitDisplays = [];
let lastSecond = -1;
let ampmDisplay = null;

// Layout parameters
let digitStartX = 0;
let digitSpacing = 0;
let digitW = 0;
let digitH = 0;

// Visual enhancements
let bgGradient;
let glowIntensity = 0;
let pulsePhase = 0;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  // Calculate responsive sizing
  digitW = Math.min(140, Math.floor(WIDTH / 8));
  digitH = Math.floor(digitW * 2);
  const gap = Math.floor(digitW * 0.25);
  digitSpacing = digitW + gap;

  // Center the display
  const totalSlots = 6 + 1;
  digitStartX = WIDTH / 2 - ((totalSlots - 1) / 2) * digitSpacing;

  // Create digit displays
  for (let i = 0; i < 6; i++) {
    const x = digitStartX + i * digitSpacing;
    const y = HEIGHT / 2;
    const dd = new digits_display(x, y, digitW, digitH, 0);
    digitDisplays.push(dd);
  }

  // Create AM/PM display
  const ampmW = Math.floor(digitW * 0.9);
  const ampmH = Math.floor(digitH * 0.9);
  const ampmX = digitStartX + 6 * digitSpacing;
  const ampmY = HEIGHT / 2;
  ampmDisplay = new digits_display(ampmX, ampmY, ampmW, ampmH, 'A');

  updateClock();
}

function draw() {
  // Sophisticated gradient background
  drawGradientBackground();

  // Subtle animated glow effect
  pulsePhase += 0.02;
  glowIntensity = sin(pulsePhase) * 0.3 + 0.7;

  // Render all digit displays with enhanced styling
  for (let dd of digitDisplays) {
    dd.render();
  }

  // Professional colon styling
  drawColons();

  // Update clock every second
  const now = new Date();
  const s = now.getSeconds();
  if (s !== lastSecond) {
    lastSecond = s;
    updateClock();
  }

  // Render AM/PM indicator
  renderAmPm(now);

  // Add subtle date display at bottom
  drawDateDisplay(now);
}

function drawGradientBackground() {
  // Create radial gradient effect
  for (let i = 0; i < HEIGHT; i++) {
    let inter = map(i, 0, HEIGHT, 0, 1);
    let c = lerpColor(color(8, 12, 20), color(18, 22, 35), inter);
    stroke(c);
    line(0, i, WIDTH, i);
  }

  // Add subtle vignette
  noStroke();
  let vignetteGradient = drawingContext.createRadialGradient(
    WIDTH / 2, HEIGHT / 2, HEIGHT * 0.3,
    WIDTH / 2, HEIGHT / 2, HEIGHT * 0.8
  );
  vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  drawingContext.fillStyle = vignetteGradient;
  rect(0, 0, WIDTH, HEIGHT);
}

function drawColons() {
  // Enhanced colon styling with glow
  const colonY1 = HEIGHT / 2 - digitH * 0.25;
  const colonY2 = HEIGHT / 2 + digitH * 0.25;
  const colonX1 = digitStartX + digitSpacing * 1.5;
  const colonX2 = digitStartX + digitSpacing * 3.5;
  const colonSize = digitW * 0.12;

  // Glow effect
  drawingContext.shadowBlur = 20 * glowIntensity;
  drawingContext.shadowColor = 'rgba(255, 215, 0, 0.8)';

  fill(255, 230, 100);
  noStroke();

  ellipse(colonX1, colonY1, colonSize);
  ellipse(colonX1, colonY2, colonSize);
  ellipse(colonX2, colonY1, colonSize);
  ellipse(colonX2, colonY2, colonSize);

  drawingContext.shadowBlur = 0;
}

function renderAmPm(now) {
  const hours24 = now.getHours();
  const isPM = hours24 >= 12;
  const ampmSymbol = isPM ? 'P' : 'A';

  let amX = digitStartX + 5 * digitSpacing + digitSpacing * 0.95;
  const amY = HEIGHT / 2;
  const amWidth = ampmDisplay ? ampmDisplay.w : Math.floor(digitW * 0.9);

  if (amX + amWidth / 2 + 8 > WIDTH) {
    amX = WIDTH - (amWidth / 2) - 8;
  }

  if (ampmDisplay) {
    ampmDisplay.x = amX;
    ampmDisplay.y = amY;
    ampmDisplay.setDigit(ampmSymbol);
    ampmDisplay.render();
  }
}

function drawDateDisplay(now) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  const dateString = `${dayName}, ${monthName} ${date}, ${year}`;

  textAlign(CENTER, CENTER);
  textSize(18);
  fill(150, 160, 180);
  noStroke();
  text(dateString, WIDTH / 2, HEIGHT - 50);
}

function updateClock() {
  const now = new Date();
  let h = now.getHours();
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