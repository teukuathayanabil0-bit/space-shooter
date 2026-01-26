const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ================= INPUT ================= */
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* ===== MOBILE CONTROL ===== */
let joyX = 0, joyY = 0;
let shooting = false;
let dragging = false;

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
const shootBtn = document.getElementById("shootBtn");

joystick.addEventListener("touchstart", () => dragging = true);

document.addEventListener("touchend", () => {
  dragging = false;
  joyX = joyY = 0;
  stick.style.left = "40px";
  stick.style.top = "40px";
});

document.addEventListener("touchmove", e => {
  if (!dragging) return;
  const rect = joystick.getBoundingClientRect();
  const t = e.touches[0];

  let x = t.clientX - rect.left - 60;
  let y = t.clientY - rect.top - 60;

  const dist = Math.hypot(x, y);
  if (dist > 40) {
    x = (x / dist) * 40;
    y = (y / dist) * 40;
  }

  joyX = x / 40;
  joyY = y / 40;

  stick.style.left = 40 + x + "px";
  stick.style.top = 40 + y + "px";
});

shootBtn.addEventListener("touchstart", () => shooting = true);
shootBtn.addEventListener("touchend", () => shooting = false);

/* ================= GAME OBJECT ================= */
const player = {
  x: 400,
  y: 500,
  vx: 0,
  vy: 0,
  size: 20,
  speed: 0.6,
  maxSpeed: 6,
  hp: 100,
  cooldown: 0
};

let bullets = [];
let enemies = [];
let boss = null;
let score = 0;

/* ================= FUNCTIONS ================= */
function shoot() {
  bullets.push({
    x: player.x,
    y: player.y,
    vy: -10,
    damage: 10
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * 760 + 20,
    y: -20,
    vx: Math.random() * 2 - 1,
    vy: 2,
    size: 18,
    hp: 20
  });
}

function spawnBoss() {
  boss = {
    x: 400,
    y: 120,
    hp: 600
  };
}

/* ================= UPDATE ================= */
function update() {
  // Keyboard movement
  if (keys["a"] || keys["ArrowLeft"]) player.vx -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.vx += player.speed;
  if (keys["w"] || keys["ArrowUp"]) player.vy -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.vy += player.speed;

  // Mobile joystick
  player.vx += joyX * player.speed * 1.5;
  player.vy += joyY * player.speed * 1.5;

  // Inertia
  player.vx *= 0.9;
  player.vy *= 0.9;

  player.vx = Math.max(-player.maxSpeed, Math.min(player.vx, player.maxSpeed));
  player.vy = Math.max(-player.maxSpeed, Math.min(player.vy, player.maxSpeed));

  player.x += player.vx;
  player.y += player.vy;

  // Shooting
  if ((keys[" "] || shooting) && player.cooldown <= 0) {
    shoot();
    player.cooldown = 15;
  }
  player.cooldown--;

  // Bullets
  bullets.forEach(b => b.y += b.vy);
  bullets = bullets.filter(b => b.y > -20);

  // Enemies
  enemies.forEach(e => {
    e.x += e.vx;
    e.y += e.vy;
  });

  // Collision
  bullets.forEach(b => {
    enemies.forEach(e => {
      if (Math.hypot(b.x - e.x, b.y - e.y) < e.size) {
        e.hp -= b.damage;
        b.y = -100;
      }
    });

    if (boss && Math.hypot(b.x - boss.x, b.y - boss.y) < 60) {
      boss.hp -= b.damage;
      b.y = -100;
    }
  });

  enemies = enemies.filter(e => {
    if (e.hp <= 0) {
      score += 10;
      return false;
    }
    return true;
  });

  if (score >= 200 && !boss) spawnBoss();
}

/* ================= DRAW ================= */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 10));

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Boss
  if (boss) {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.fillRect(200, 20, boss.hp / 2, 10);
  }

  // UI
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);
}

/* ================= LOOP ================= */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

setInterval(spawnEnemy, 1000);
loop();
