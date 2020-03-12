const score = document.querySelector(".score");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);
document.addEventListener('click', start);

let player = {
    score: 0,
    speed: 2,
    inplay: false
};

let keys = {
    space: false
}

function start() {

    let stages = prompt("What number of levels you'd like to play for?", 3);

    gameMessage.classList.add("hide");
    score.innerHTML = "<span>2000</span>";
    document.removeEventListener('click', start);
    player.inplay = true;
    makeEnemy();
    player.level = stages;
    player.score = 2000;
    player.totalBombs = 2;
    player.ready = true;
    player.activeBomb = 0;
    player.bombCount = 0;
    player.plane = document.createElement("div");
    player.plane.classList.add("plane");
    gameArea.appendChild(player.plane);
    window.requestAnimationFrame(playGame);
    player.x = player.plane.offsetLeft;
    player.y = player.plane.offsetTop;
    //x, y coordinates of the plane
}

function makeEnemy() {
    player.level--;
    if (player.level < 0) {
        endGame();
    } else {
        player.base = document.createElement("div");
        player.base.setAttribute("class", "base");
        player.base.style.width = Math.floor(Math.random() * 200) + 10 + "px";
        player.base.style.height = Math.floor(Math.random() * 100) + 100 + "px";
        player.base.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 200)) + 100 + "px";
        gameArea.appendChild(player.base);
    }
}

function makeBomb() {
    if (player.ready && (player.activeBomb < player.totalBombs)) {
        player.score -= 300;
        player.bombCount++;
        player.activeBomb++;
        let bomb = document.createElement("div");
        bomb.classList.add("bomb");
        bomb.innerHTML = player.bombCount;
        bomb.y = player.y;
        bomb.x = player.x;
        bomb.style.left = bomb.x + "px";
        bomb.style.top = bomb.y + "px";
        gameArea.appendChild(bomb);
        player.ready = false;
        setTimeout(function () {
            player.ready = true;
        }, 500);
    }
}

function moveBomb() {
    let bombs = document.querySelectorAll(".bomb");
    bombs.forEach((item) => {
        item.y += 5;
        item.style.top = item.y + "px";
        if (item.y > 1000) {
            player.activeBomb--;
            item.parentElement.removeChild(item);
        }
        if (isCollide(item, player.base)) {
            player.activeBomb--;
            player.score += 2000;
            player.base.parentElement.removeChild(player.base);
            item.parentElement.removeChild(item);
            makeEnemy();
        }
    })
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) || (aRect.left > bRect.right)
    )

}

function playGame() {
    if (player.inplay) {
        moveBomb();
        if (keys.space) {
            makeBomb();
        }
        if (keys.ArrowUp && player.y > 100) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < 200) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < (gameArea.offsetWidth - 100)) {
            player.x += player.speed;
        }
        player.x += (player.speed * 2);
        if (player.x > gameArea.offsetWidth) {
            player.x = 0;
            player.score -= 100;
        }
        player.score--;
        if (player.score < 0) {
            player.score = 0;
        }
        score.innerHTML = "Score: " + player.score;
        player.plane.style.left = player.x + "px";
        player.plane.style.top = player.y + "px";
        window.requestAnimationFrame(playGame);
    }
}

function pressOn(e) {
    e.preventDefault();
    let tempKey = (e.key == " ") ? "space" : e.key;
    keys[tempKey] = true;
}
function pressOff(e) {
    e.preventDefault();
    let tempKey = (e.key == " ") ? "space" : e.key;
    keys[tempKey] = false;
}

function endGame() {
    console.log("GAME OVER");
    player.inplay = false;
    gameMessage.classList.remove("hide");
    player.plane.parentElement.removeChild(player.plane);
    player.score = 0;
    document.addEventListener('click', start);
}
