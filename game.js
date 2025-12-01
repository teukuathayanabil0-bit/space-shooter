const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 550, width: 40, height: 40 };
let bullets = [];
let enemies = [];

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
    if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += 20;
    if (e.key === " "){ 
        bullets.push({ x: player.x + 18, y: player.y });
    }
});

function createEnemy() {
    enemies.push({ x: Math.random() * 360, y: 0, width: 40, height: 40 });
}

setInterval(createEnemy, 1000);

function update() {
    bullets.forEach(b => b.y -= 5);
    enemies.forEach(e => e.y += 2);

    bullets = bullets.filter(b => b.y > 0);

    enemies = enemies.filter(e => {
        for (let b of bullets) {
            if (b.x < e.x + e.width &&
                b.x + 5 > e.x &&
                b.y < e.y + e.height &&
                b.y + 10 > e.y) {
                bullets.splice(bullets.indexOf(b), 1);
                return false;
            }
        }
        return e.y < canvas.height;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "yellow";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 5, 10));

    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
