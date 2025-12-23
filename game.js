// ===== AMAN ANTI-ERROR AUDIO =====
const shootSound = document.getElementById("shootSound") || { play(){} };
const explosionSound = document.getElementById("explosionSound") || { play(){} };
const bgm = document.getElementById("bgm") || { play(){}, pause(){}, volume:0 };

// ===== CANVAS =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ===== UI =====
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const gameOverScreen = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

canvas.style.pointerEvents = "none"; // penting

// ===== GAME STATE =====
let gameRunning = false;
let score = 0;

// ===== PLAYER =====
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  w: 40,
  h: 40,
  speed: 5
};

// ===== BULLET & ENEMY =====
let bullets = [];
let enemies = [];

// ===== INPUT =====
let left = false;
let right = false;

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") left = true;
  if (e.key === "ArrowRight") right = true;
  if (e.key === " ") shoot();
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") left = false;
  if (e.key === "ArrowRight") right = false;
});

// ===== BUTTON FIX (INI INTI MASALAH KAMU) =====
startBtn.onclick = () => {
  menu.style.display = "none";
  canvas.style.pointerEvents = "auto";
  gameRunning = true;
  bgm.volume = 0.4;
  bgm.play();
  loop();
};

restartBtn.onclick = () => {
  gameOverScreen.style.display = "none";
  resetGame();
  gameRunning = true;
  loop();
};

// ===== FUNCTIONS =====
function shoot() {
  bullets.push({
    x: player.x + player.w / 2 - 3,
    y: player.y,
    w: 6,
    h: 10,
    speed: 7
  });
  shootSound.play();
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    w: 40,
    h: 40,
    speed: 2 + Math.random() * 2
  });
}

function resetGame() {
  score = 0;
  bullets = [];
  enemies = [];
  player.x = canvas.width / 2 - 20;
}

function gameOver() {
  gameRunning = false;
  canvas.style.pointerEvents = "none";
  bgm.pause();
  gameOverScreen.style.display = "flex";
}

// ===== MAIN LOOP =====
function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // PLAYER MOVE
  if (left && player.x > 0) player.x -= player.speed;
  if (right && player.x + player.w < canvas.width) player.x += player.speed;

  // DRAW PLAYER
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // BULLETS
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    if (b.y < 0) bullets.splice(i, 1);
  });

  // ENEMIES
  enemies.forEach((e, ei) => {
    e.y += e.speed;
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // COLLISION PLAYER
    if (
      e.x < player.x + player.w &&
      e.x + e.w > player.x &&
      e.y < player.y + player.h &&
      e.y + e.h > player.y
    ) {
      explosionSound.play();
      gameOver();
    }

    // COLLISION BULLET
    bullets.forEach((b, bi) => {
      if (
        b.x < e.x + e.w &&
        b.x + b.w > e.x &&
        b.y < e.y + e.h &&
        b.y + b.h > e.y
      ) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        explosionSound.play();
        score++;
      }
    });

    if (e.y > canvas.height) enemies.splice(ei, 1);
  });

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  requestAnimationFrame(loop);
}

// ===== ENEMY SPAWN TIMER =====
setInterval(() => {
  if (gameRunning) spawnEnemy();
}, 1000);
