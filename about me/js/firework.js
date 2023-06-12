const canvas = document.querySelector("#canvas");
let canvasSize;
let vw = document.documentElement.clientWidth;
let vh = document.documentElement.clientHeight;
let c = canvas.getContext("2d");
function resize() {
  vw = document.documentElement.clientWidth;
  vh = document.documentElement.clientHeight;
  canvas.width = vw;
  canvas.height = vh;
}
resize();
window.addEventListener("resize", resize);

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getTwoUniqueRandomNumbers(range) {
  let num1 = Math.floor(Math.random() * range);
  let num2 = Math.floor(Math.random() * range);
  while (num1 === num2) {
    num2 = Math.floor(Math.random() * range);
  }
  return [num1, num2];
}

const gravity = 0.02;
const friction = 0.95;
const power = 10;

let colorArray = [
  "#2ecce0",
  "#ff6a71",
  "#fccf31",
  "#fa7c49",
  "#92fe9d",
  "#ffffff"
];

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();

    c.globalAlpha = this.alpha;
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    c.restore();
  }

  update() {
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.velocity.y += gravity;

    this.y += this.velocity.y;
    this.x += this.velocity.x;

    this.alpha -= 0.008;
  }
}

let particleArray = [];

let mouse = {
  x: 0,
  y: 0
};

function playFirework(e) {
  mouse.x = e.x;
  mouse.y = e.y;

  const particleCount = 180;
  const particleRadius = 1.5;
  const angleIncrement = (Math.PI * 2) / particleCount;

  const randomTowColor = getTwoUniqueRandomNumbers(colorArray.length);

  for (let i = 0; i < particleCount; i++) {
    const particleColor = colorArray[randomTowColor[randomIntFromRange(0, 1)]];

    const particleVelocity = {
      x: Math.cos(angleIncrement * i) * power * Math.random(),
      y: Math.sin(angleIncrement * i) * power
    };

    particleArray.push(
      new Particle(
        mouse.x,
        mouse.y,
        particleRadius,
        particleColor,
        particleVelocity
      )
    );
  }
}

canvas.addEventListener("click", (e) => {
  playFirework(e);
});

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.2)";
  c.fillRect(0, 0, vw, vh);

  particleArray.forEach((particle, i) => {
    if (particle.alpha > 0) {
      particle.draw();
      particle.update();
    } else {
      particleArray.splice(i, 1);
    }
  });
}

animate();
