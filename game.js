// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player (Spaceship)
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 50,
    speed: 5
};

// Bullets
let bullets = [];
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 12
    });
}

// Enemies
let enemies = [];
let score = 0;

// Spawn enemy every 1.5 sec
setInterval(() => {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2
    });
}, 1500);

// Keyboard controls
let keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Update Player Movement
function updatePlayer() {
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;
    if (keys["Space"]) shoot();
}

// Bullets update
function updateBullets() {
    bullets.forEach((b, i) => {
        b.y -= 6;
        if (b.y < 0) bullets.splice(i, 1);
    });
}

// Enemy update & collision
function updateEnemies() {
    enemies.forEach((enemy, ei) => {
        enemy.y += enemy.speed;

        if (enemy.y > canvas.height) {
            alert("Game Over! Score: " + score);
            document.location.reload();
        }

        bullets.forEach((b, bi) => {
            if (
                b.x < enemy.x + enemy.width &&
                b.x + b.width > enemy.x &&
                b.y < enemy.y + enemy.height &&
                b.y + b.height > enemy.y
            ) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score++;
            }
        });
    });
}

// Draw objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background stars
    ctx.fillStyle = "white";
    for (let i = 0; i < 50; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Player
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Bullets
    ctx.fillStyle = "yellow";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Enemies
    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));

    // Score text
    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

// GAME LOOP
function gameLoop() {
    updatePlayer();
    updateBullets();
    updateEnemies();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();

// =================================
// TOUCH CONTROLS FOR MOBILE
// =================================

const joystick = document.getElementById("joystick");
const shootBtn = document.getElementById("shootBtn");

let joystickActive = false;
let startX = 0;

joystick.addEventListener("touchstart", (e) => {
    joystickActive = true;
    startX = e.touches[0].clientX;
});

joystick.addEventListener("touchmove", (e) => {
    if (!joystickActive) return;
    let moveX = e.touches[0].clientX;

    if (moveX < startX - 20) player.x -= player.speed;
    if (moveX > startX + 20) player.x += player.speed;

    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
});

joystick.addEventListener("touchend", () => joystickActive = false);

shootBtn.addEventListener("touchstart", () => shoot());
