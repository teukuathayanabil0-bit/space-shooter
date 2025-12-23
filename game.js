const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let hp = 3;
let gameRunning = false;

const player = { x: canvas.width/2-25, y: canvas.height-80, w:50, h:50, speed:7 };
const bullets = [];
const enemies = [];

let boss = null;
let bossHP = 50;

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const shootSound = document.getElementById("shootSound");
const explosionSound = document.getElementById("explosionSound");
const bgm = document.getElementById("bgm");

document.getElementById("startBtn").onclick = () => {
  document.getElementById("menu").style.display = "none";
  bgm.volume = 0.4;
  bgm.play();
  gameRunning = true;
  loop();
};

function shoot() {
  bullets.push({ x:player.x+22, y:player.y, w:6, h:15, speed:10 });
  shootSound.currentTime = 0;
  shootSound.play();
}

setInterval(() => {
  if (gameRunning && !boss)
    enemies.push({
      x: Math.random()*(canvas.width-40),
      y: -40,
      w: 40,
      h: 40,
      speed: 3 + Math.random()*2
    });
}, 800);

function update() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x+player.w < canvas.width) player.x += player.speed;
  if (keys[" "] && bullets.length < 5) shoot();

  bullets.forEach(b => b.y -= b.speed);
  enemies.forEach(e => e.y += e.speed);

  bullets.forEach((b,bi)=>{
    enemies.forEach((e,ei)=>{
      if (b.x<e.x+e.w && b.x+b.w>e.x && b.y<e.y+e.h && b.y+b.h>e.y){
        bullets.splice(bi,1);
        enemies.splice(ei,1);
        explosionSound.play();
        score+=10;
      }
    });
  });

  enemies.forEach((e,ei)=>{
    if (e.y > canvas.height){
      enemies.splice(ei,1);
      hp--;
    }
  });

  if (score >= 200 && !boss){
    boss = { x:canvas.width/2-80, y:-150, w:160, h:80, speed:1 };
  }

  if (boss){
    if (boss.y < 50) boss.y += boss.speed;
    boss.x += Math.sin(Date.now()*0.002)*2;

    bullets.forEach((b,bi)=>{
      if (b.x<boss.x+boss.w && b.x+b.w>boss.x && b.y<boss.y+boss.h && b.y+b.h>boss.y){
        bullets.splice(bi,1);
        bossHP--;
      }
    });

    if (bossHP <= 0){
      boss = null;
      bossHP = 50;
      score += 200;
    }
  }

  if (hp <= 0) endGame();

  document.getElementById("score").innerText = "Score: "+score;
  document.getElementById("health").innerText = "HP: "+hp;
  document.getElementById("highscore").innerText =
    "High: " + (localStorage.getItem("highscore") || 0);
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="cyan";
  ctx.fillRect(player.x,player.y,player.w,player.h);

  ctx.fillStyle="yellow";
  bullets.forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));

  ctx.fillStyle="red";
  enemies.forEach(e=>ctx.fillRect(e.x,e.y,e.w,e.h));

  if (boss){
    ctx.fillStyle="purple";
    ctx.fillRect(boss.x,boss.y,boss.w,boss.h);

    ctx.fillStyle="white";
    ctx.fillRect(boss.x,boss.y-10,boss.w,5);
    ctx.fillStyle="lime";
    ctx.fillRect(boss.x,boss.y-10,boss.w*(bossHP/50),5);
  }
}

function loop(){
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

function endGame(){
  gameRunning = false;
  bgm.pause();
  let high = localStorage.getItem("highscore") || 0;
  if (score > high) localStorage.setItem("highscore", score);
  document.getElementById("finalScore").innerText = "Score: "+score;
  document.getElementById("gameOver").style.display="flex";
}
