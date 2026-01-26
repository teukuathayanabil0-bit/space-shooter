const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* FULLSCREEN */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* INPUT */
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* MOBILE CONTROL */
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
  const r = joystick.getBoundingClientRect();
  const t = e.touches[0];

  let x = t.clientX - r.left - 60;
  let y = t.clientY - r.top - 60;

  const d = Math.hypot(x, y);
  if (d > 40) {
    x = (x / d) * 40;
    y = (y / d) * 40;
  }

  joyX = x / 40;
  joyY = y / 40;

  stick.style.left = 40 + x + "px";
  stick.style.top = 40 + y + "px";
});

shootBtn.addEventListener("touchstart", () => shooting = true);
shootBtn.addEventListener("touchend", () => shooting = false);

/* GAME DATA */
const player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  vx: 0,
  vy: 0,
  size: 18,
  speed: 0.7,
  maxSpeed: 7,
  cooldown: 0
};

let bullets = [];
let enemies = [];
let boss = null;
let score = 0;

/* FUNCTIONS */
function shoot() {
  bullets.push({
    x: player.x,
    y: player.y,
    vy: -12,
    damage: 10
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 40) + 20,
    y: -30,
    vx: Math.random() * 2 - 1,
    vy: 2 + Math.random() * 2,
    size: 16,
    hp: 20
  });
}

function spawnBoss() {
  boss = {
    x: canvas.width / 2,
    y: 120,
    hp: 500
  };
}

/* UPDATE */
function update() {
  /* MOVEMENT */
  if (keys["a"] || keys["ArrowLeft"]) player.vx -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.vx += player.speed;
  if (keys["w"] || keys["ArrowUp"]) player.vy -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.vy += player.speed;

  player.vx += joyX * player.speed * 1.5;
  player.vy += joyY * player.speed * 1.5;

  player.vx *= 0.9;
  player.vy *= 0.9;

  player.vx = Math.max(-player.maxSpeed, Math.min(player.vx, player.maxSpeed));
  player.vy = Math.max(-player.maxSpeed, Math.min(player.vy, player.maxSpeed));

  player.x += player.vx;
  player.y += player.vy;

  /* SHOOT */
  if ((keys[" "] || shooting) && player.cooldown <= 0) {
    shoot();
    player.cooldown = 12;
  }
  player.cooldown--;

  /* BULLETS */
  bullets.forEach(b => b.y += b.vy);
  bullets = bullets.filter(b => b.y > -50);

  /* ENEMIES */
  enemies.forEach(e => {
    e.x += e.vx;
    e.y += e.vy;
  });

  /* COLLISION */
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
    return e.y < canvas.height + 50;
  });

  if (score >= 200 && !boss) spawnBoss();
}

/* DRAW */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* PLAYER */
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  /* BULLETS */
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 12));

  /* ENEMIES */
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  });

  /* BOSS */
  if (boss) {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 150, 20, boss.hp / 2, 10);
  }

  /* UI */
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Enemy: " + enemies.length, 10, 40);
}

/* LOOP */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

setInterval(spawnEnemy, 700);
loop();
