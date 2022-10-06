const bird = new Image();
const background = new Image();
const pipeTop = new Image();
const pipeBottom = new Image();

const canvasXSize = 640;
const canvasYSize = 640;
const birdXSize = 55;
const birdYSize = 55;
const birdInitialX = canvasXSize / 2 - birdXSize / 2;
const birdInitialY = canvasYSize / 2 - birdYSize / 2;
const pipeXSize = 75;
const pipeYSize = canvasYSize / 2;
const backgroundSpeed = 5;

let ctx;
let bgOffset = 1;
let birdOffset = 1;
let isJumping = false;
let jumpScore = 0;
let pipes = [];

let pipeSpacing = 200;
let pipeGap = 200;

let isGamePlaying = false;
let currentScore = 0;
let highestScore = 0;

//#region background
const animateBackground = () => {
  if (bgOffset < canvasXSize) bgOffset += backgroundSpeed;
  else bgOffset = 1;

  ctx.drawImage(background, -bgOffset, 0, canvasXSize, canvasYSize);
  ctx.drawImage(background, canvasXSize - bgOffset, 0, canvasYSize, canvasYSize);
};
//#endregion

//#region bird
const animateBird = () => {
  if (isGamePlaying) {
    if (isJumping) {
      jumpScore++;
      if (jumpScore < 20) {
        birdOffset -= 3;
      } else {
        isJumping = false;
      }
    } else {
      if (birdOffset < birdInitialY) {
        birdOffset += 5;
      }
    }
  }
  ctx.drawImage(bird, birdInitialX, birdInitialY + birdOffset, birdXSize, birdYSize);
};
const jump = () => {
  jumpScore = 0;
  isJumping = true;
  if (!isGamePlaying) {
    isGamePlaying = true;
    resetGame();
  }
};
//#endregion

//#region pipes
const pipeLocation = () => Math.random() * (canvasYSize - (pipeGap + pipeXSize) - pipeXSize);

const assignPipes = () => {
  pipes = Array(3)
    .fill()
    .map((_, i) => {
      return [canvasXSize + i * (pipeSpacing + pipeXSize), pipeLocation(), false];
    });
};

const animatePipe = () => {
  pipes.map((pipe) => {
    pipe[0] -= 3;

    ctx.drawImage(pipeTop, pipe[0], 0, pipeXSize, pipe[1]);
    ctx.drawImage(pipeBottom, pipe[0], pipe[1] + pipeGap, pipeXSize, canvasYSize - pipe[1] + pipeGap);

    if (pipe[0] < -pipeXSize) {
      pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeSpacing + pipeXSize, pipeLocation()]];
    }

    const birdYPosition = birdInitialY + birdOffset;

    if (pipe[0] + birdXSize >= birdInitialX && pipe[0] <= birdInitialX + birdXSize) {
      if (pipe[1] >= birdYPosition || pipe[1] + pipeGap - birdYSize <= birdYPosition) {
        isGamePlaying = false;
        resetGame();
      } else if (!pipe[2]) {
        pipe[2] = true;
        currentScore++;
        highestScore = currentScore > highestScore ? currentScore : highestScore;
      }
    }
  });
};
//#endregion

const renderMenu = () => {
  renderHeader();
  ctx.fillText(`Highest Score: ${currentScore}`, canvasXSize / 2 - 105, canvasYSize / 2 - 150);
  ctx.fillText(`Click to play`, canvasXSize / 2 - 85, canvasYSize / 2 + 150);
};

const renderHeader = () => {
  ctx.fillText(`Current Score: ${currentScore}`, 10, 40);
  !isGamePlaying && ctx.fillText(`Highest Score: ${highestScore}`, 400, 40);
};

const resetGame = () => {
  birdOffset = 1;
  isJumping = false;
  jumpScore = 0;
  currentScore = 0;
  assignPipes();
  animateBird();
};

const render = () => {
  animateBackground();
  renderHeader();
  animateBird();
  if (!isGamePlaying) {
    renderMenu();
  } else {
    animatePipe();
  }

  requestAnimationFrame(render);
};

const init = () => {
  ctx = document.getElementById("flappyBirdCanvas").getContext("2d");
  ctx.font = "30px Arial";

  background.src = "./assets/background.png";
  pipeBottom.src = "./assets/pipe-bottom.png";
  pipeTop.src = "./assets/pipe-top.png";
  setTimeout(() => {
    bird.src = "./assets/bird.png";
  }, 10);

  render();
};

window.onclick = jump;

init();
