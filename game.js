const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 50,
    width: 40,
    height: 20,
    speed: 5
};

// Peluru & Musuh
let bullets = [];
let enemies = [];
let enemySpawnTime = 0;

// Kontrol
let leftPressed = false;
let rightPressed = false;
let shootPressed = false;

document.getElementById("leftBtn").ontouchstart = () => leftPressed = true;
document.getElementById("leftBtn").ontouchend = () => leftPressed = false;
document.getElementById("rightBtn").ontouchstart = () => rightPressed = true;
document.getElementById("rightBtn").ontouchend = () => rightPressed = false;
document.getElementById("shootBtn").ontouchstart = () => shootPressed = true;
document.getElementById("shootBtn").ontouchend = () => shootPressed = false;

function drawPlayer() {
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach((b, i) => {
        ctx.fillRect(b.x, b.y, 5, 10);
        b.y -= 7;
        if (b.y < 0) bullets.splice(i, 1);
    });
}

function spawnEnemy() {
    if (enemySpawnTime <= 0) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -20,
            width: 40,
            height: 20,
            speed: 2
        });
        enemySpawnTime = 50;
    }
    enemySpawnTime--;
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach((e, i) => {
        e.y += e.speed;
        ctx.fillRect(e.x, e.y, e.width, e.height);

        // jika musuh keluar
        if (e.y > canvas.height) enemies.splice(i, 1);

        bullets.forEach((b, j) => {
            if (b.x < e.x + e.width &&
                b.x + 5 > e.x &&
                b.y < e.y + e.height &&
                b.y + 10 > e.y) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
            }
        });
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (leftPressed && player.x > 0) player.x -= player.speed;
    if (rightPressed && player.x < canvas.width - player.width) player.x += player.speed;
    if (shootPressed) {
        bullets.push({ x: player.x + 18, y: player.y });
        shootPressed = false;
    }

    drawPlayer();
    drawBullets();
    spawnEnemy();
    drawEnemies();

    requestAnimationFrame(update);
}

update();
