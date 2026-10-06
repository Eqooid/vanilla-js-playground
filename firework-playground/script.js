const canvas = document.getElementById("fireworks-canvas");
const context = canvas.getContext("2d");

// Try changing these values to change the look of the fireworks.
const PARTICLE_COUNT = 70;
const PARTICLE_SPEED = 5;
const FIREWORK_SPEED = 7;
const GRAVITY = 0.04;
const FRICTION = 0.98;
const FADE_SPEED = 0.012;

let fireworks = [];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Firework {
  constructor(targetX, targetY) {
    this.x = canvas.width / 2;
    this.y = canvas.height;
    this.previousX = this.x;
    this.previousY = this.y;
    this.targetX = targetX;
    this.targetY = targetY;

    // Normalize the direction so the firework moves at a steady speed.
    const distanceX = targetX - this.x;
    const distanceY = targetY - this.y;
    const distance = Math.hypot(distanceX, distanceY);
    this.velocityX = (distanceX / distance) * FIREWORK_SPEED;
    this.velocityY = (distanceY / distance) * FIREWORK_SPEED;
    this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
  }

  update() {
    this.previousX = this.x;
    this.previousY = this.y;

    const distanceToTarget = Math.hypot(
      this.targetX - this.x,
      this.targetY - this.y
    );

    if (distanceToTarget <= FIREWORK_SPEED) {
      this.x = this.targetX;
      this.y = this.targetY;
      return true;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
    return false;
  }

  draw() {
    context.beginPath();
    context.moveTo(this.previousX, this.previousY);
    context.lineTo(this.x, this.y);
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.stroke();
  }

  explode() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * PARTICLE_SPEED;
      particles.push(new Particle(this.x, this.y, angle, speed, this.color));
    }
  }
}

class Particle {
  constructor(x, y, angle, speed, color) {
    this.x = x;
    this.y = y;
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
    this.color = color;
    this.opacity = 1;
    this.radius = 2;
  }

  update() {
    this.velocityX *= FRICTION;
    this.velocityY *= FRICTION;
    this.velocityY += GRAVITY;
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.opacity -= FADE_SPEED;

    return this.opacity <= 0;
  }

  draw() {
    context.globalAlpha = this.opacity;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.globalAlpha = 1;
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update backwards so finished objects can be removed safely.
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i];

    if (firework.update()) {
      firework.explode();
      fireworks.splice(i, 1);
    } else {
      firework.draw();
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];

    if (particle.update()) {
      particles.splice(i, 1);
    } else {
      particle.draw();
    }
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
  const bounds = canvas.getBoundingClientRect();
  const targetX = event.clientX - bounds.left;
  const targetY = event.clientY - bounds.top;
  fireworks.push(new Firework(targetX, targetY));
});

animate();