window.onload = () => {

  // ===== ELEMENT =====
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const menu = document.getElementById("menu");
  const startBtn = document.getElementById("startBtn");
  const gameOver = document.getElementById("gameOver");

  const scoreText = document.getElementById("score");

  const shootSound = document.getElementById("shootSound") || { play(){} };
  const explosionSound = document.getElementById("explosionSound") || { play(){} };
  const bgm = document.getElementById("bgm") || { play(){}, pause(){}, volume:0 };

  // ===== CANVAS =====
  canvas.width = 400;
  canvas.height = 600;
  canvas.style.pointerEvents = "none"; // 🔥 PENTING

  // ===== GAME STATE =====
  let gameRunning = false;
  let score = 0;

  // ===== PLAYER =====
  const player = {
    x: 180,
    y: 520,
    w: 40,
    h: 40,
    speed: 5
  };

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

  // ===== START BUTTON (FIX INTI) =====
  startBtn.addEventListener("click", () => {
    console.log("START DIKLIK"); // 🔍 bukti hidup
    menu.style.display = "none";
    canvas.style.pointerEvents = "auto";
    gameRunning = true;
    bgm.volume = 0.4;
    bgm.play();
    loop();
  });

  // ===== FUNCTIONS =====
  function shoot() {
    if (!gameRunning) return;
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
      x: Math.random() * 360,
      y: -40,
      w: 40,
      h: 40,
      speed: 2
    });
  }

  function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // MOVE
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

      // HIT PLAYER
      if (
        e.x < player.x + player.w &&
        e.x + e.w > player.x &&
        e.y < player.y + player.h &&
        e.y + e.h > player.y
      ) {
        explosionSound.play();
        gameRunning = false;
        gameOver.style.display = "flex";
      }

      bullets.forEach((b, bi) => {
        if (
          b.x < e.x + e.w &&
          b.x + b.w > e.x &&
          b.y < e.y + e.h &&
          b.y + b.h > e.y
        ) {
          bullets.splice(bi, 1);
          enemies.splice(ei, 1);
          score++;
          scoreText.textContent = "Score: " + score;
          explosionSound.play();
        }
      });
    });

    requestAnimationFrame(loop);
  }

  setInterval(() => {
    if (gameRunning) spawnEnemy();
  }, 1000);

};
