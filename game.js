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

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Suara
const shootSound = new Audio("https://tinyurl.com/laser-sfx");
const explosionSound = new Audio("https://tinyurl.com/explosion-sfx");

// Spawn musuh alien
setInterval(() => {
    if (!gameOver) {
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: -40,
            width: 40,
            height: 40,
            speed: 2
        });
    }
}, 900);

// Kontrol HP
let leftPressed = false;
let rightPressed = false;
let shootPressed = false;

document.getElementById("leftBtn").ontouchstart = () => leftPressed = true;
document.getElementById("leftBtn").ontouchend = () => leftPressed = false;
document.getElementById("rightBtn").ontouchstart = () => rightPressed = true;
document.getElementById("rightBtn").ontouchend = () => rightPressed = false;
document.getElementById("shootBtn").ontouchstart = () => shootPressed = true;
document.getElementById("shootBtn").ontouchend = () => shootPressed = false;

function resetGame() {
    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;
    player.x = canvas.width / 2 - 20;
}

// Gambar Alien
function drawAliens() {
    enemies.forEach((e, i) => {
        e.y += e.speed;

        // Kepala
        ctx.fillStyle = "lime";
        ctx.beginPath();
        ctx.arc(e.x + e.width/2, e.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();

        // Badan
        ctx.fillRect(e.x + 5, e.y + 25, 30, 18);

        // Mata
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(e.x + 12, e.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.x + 28, e.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();

        if (e.y > canvas.height) {
            gameOver = true;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.fillText("GAME OVER!", canvas.width / 2 - 110, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Tap TEMBAK untuk restart", canvas.width / 2 - 140, canvas.height / 2 + 40);

        if (shootPressed) resetGame();
        return requestAnimationFrame(draw);
    }

    // Gerak player
    if (leftPressed && player.x > 0) player.x -= player.speed;
    if (rightPressed && player.x < canvas.width - player.width) player.x += player.speed;

    if (shootPressed) {
        bullets.push({ x: player.x + 18, y: player.y });
        shootSound.currentTime = 0;
        shootSound.play();
        shootPressed = false;
    }

    // Gambar player
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Gambar peluru
    ctx.fillStyle = "yellow";
    bullets.forEach((b, bi) => {
        b.y -= 7;
        ctx.fillRect(b.x, b.y, 5, 10);
        if (b.y < 0) bullets.splice(bi, 1);
    });

    // Gambar alien
    drawAliens();

    // Cek tabrakan
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (b.x < e.x + e.width && b.x + 5 > e.x && 
                b.y < e.y + e.height && b.y + 10 > e.y) {

                explosionSound.currentTime = 0;
                explosionSound.play();

                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score++;
            }
        });
    });

    // Skor
    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + score, 10, 25);

    requestAnimationFrame(draw);
}

draw();
