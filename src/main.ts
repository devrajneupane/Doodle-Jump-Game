import "./style.css";
import leftImg from "./assets/blueL.png";
import rightImg from "./assets/blueR.png";
import enemeySheet from "./assets/enemySheet.png";

import Player from "./classes/Player.ts";
import Platform from "./classes/Platform.ts";
import MovingPlatform from "./classes/MovingPlatform.ts";
import { leftPressed, rightPressed } from "./util/input.ts";
import { getLocalStorage, setLocalStorage } from "./util/util.ts";
import {
  DIMENSIONS,
  MAX_JUMP_HEIGHT,
  PLATFORM_GAP,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  START_JUMP_HEIGHT,
  STATES,
} from "./constants.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = DIMENSIONS.CANVAS_WIDTH;
canvas.height = DIMENSIONS.CANVAS_HEIGHT;

let currentState = STATES[0];

let score = 0;

let platforms: (MovingPlatform | Platform)[] = [];
let lastPlatform: Platform | MovingPlatform;

function generatePlatforms(minimumPlatforms = 5) {
  const totalPlatforms = platforms.length + minimumPlatforms;

  for (let i = platforms.length; i < totalPlatforms; i++) {
    let platform: Platform | MovingPlatform;
    const randomValue = Math.random();
    const platformY =
      (platforms[i - 1]?.y || DIMENSIONS.CANVAS_HEIGHT) - PLATFORM_GAP;
    const platformX =
      Math.random() * (DIMENSIONS.CANVAS_WIDTH - PLATFORM_WIDTH);

    if (randomValue <= 0.2) {
      platform = new MovingPlatform(
        platformX,
        platformY,
        PLATFORM_WIDTH,
        PLATFORM_HEIGHT,
        enemeySheet,
        ctx,
        Math.random() * 2 + 1,
      );
    } else {
      platform = new Platform(
        platformX,
        platformY,
        PLATFORM_WIDTH,
        PLATFORM_HEIGHT,
        enemeySheet,
        ctx,
      );
    }

    platforms.push(platform);
  }
}

function updatePlatforms() {
  for (let platform of platforms) {
    if ("updatePosition" in platform) {
      platform.updatePosition();
    }
    platform.draw();

    if (player.y < DIMENSIONS.CANVAS_HEIGHT / 2) {
      platform.y += 5;
      score += 2;
    }

    if (platform.y + PLATFORM_HEIGHT > DIMENSIONS.CANVAS_HEIGHT) {
      platforms.shift();
      generatePlatforms();
    }
  }
}

function isOnPlatform(player: Player, platform: Platform) {
  return (
    player.x < platform.x + platform.width &&
    player.x + player.width > platform.x &&
    player.y + player.height === platform.y
  );
}

function restart() {
  score = 0;
  platforms = [];
  generatePlatforms(5);

  const playerX = platforms[0].x + (PLATFORM_WIDTH - PLAYER_WIDTH) / 2;
  const playerY = DIMENSIONS.CANVAS_HEIGHT - PLATFORM_GAP - PLAYER_HEIGHT - 50;
  player.setPosition(playerX, playerY);
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    currentState = STATES[1];
    restart();
  } else if (event.key === "Space") {
    currentState = STATES[0];
    restart();
  }
});

const startDoodler = new Player(
  80,
  400,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  leftImg,
  rightImg,
  ctx,
);
const startPlatform = new Platform(
  80,
  800,
  PLATFORM_WIDTH,
  PLATFORM_HEIGHT,
  enemeySheet,
  ctx,
);

function start() {
  const startImage = new Image();
  startImage.src = "atlas3.webp";
  ctx.drawImage(startImage, 641, 0, 640, 960, 0, 0, 640, 1024);

  ctx.font = "25px Arial";
  ctx.fillStyle = "#b10000";
  ctx.fillText("Press Enter to Start", 130, 255);
  if (
    !startDoodler.grounded &&
    startDoodler.y + startDoodler.height < DIMENSIONS.CANVAS_HEIGHT
  ) {
    startDoodler.fall();
  }

  if (isOnPlatform(startDoodler, startPlatform)) {
    startDoodler.grounded = true;
    lastPlatform = startPlatform;
  }

  if (startDoodler.grounded) {
    startDoodler.jump();
  }

  if (
    lastPlatform &&
    startDoodler.y + startDoodler.height < lastPlatform.y - START_JUMP_HEIGHT
  ) {
    startDoodler.grounded = false;
  }

  startPlatform.draw();
  startDoodler.draw();
}

document.addEventListener("DOMContentLoaded", start);
document.addEventListener("DOMContentLoaded", end);

function play() {
  if (rightPressed) {
    player.moveRight();
  } else if (leftPressed) {
    player.moveLeft();
  }

  if (!player.grounded && player.y + player.height < DIMENSIONS.CANVAS_HEIGHT) {
    player.fall();
  }

  if (player.grounded) {
    player.jump();
  }

  for (const platform of platforms) {
    if (isOnPlatform(player, platform)) {
      player.grounded = true;
      lastPlatform = platform;
      break;
    }
  }

  if (
    lastPlatform &&
    player.y + player.height < lastPlatform.y - MAX_JUMP_HEIGHT
  ) {
    player.grounded = false;
  }

  if (player.y + player.height >= DIMENSIONS.CANVAS_HEIGHT) {
    player.die();
    const highScore = getLocalStorage("HIGHSCORE") ?? 0;
    if (highScore < score) {
      setLocalStorage("HIGHSCORE", score);
    }
    currentState = STATES[2];
  }

  ctx.font = "15px";
  ctx.fillText(`Score: ${score}`, 5, 20);

  ctx.font = "15px";
  ctx.fillText(`High Score: ${getLocalStorage("HIGHSCORE") ?? 0}`, 5, 40);

  updatePlatforms();
  player.draw();
}

function end() {
  // width 425 H 152 x0 y 116 ngynf.jroc
  ctx.font = "bold 40px";
  ctx.fillStyle = "#b10000";
  ctx.fillText("game over !", 50, 150);

  ctx.font = "20px";
  ctx.fillStyle = "#000";
  ctx.fillText(`Your Score: ${score}`, 40, 280);

  ctx.fillText(
    `Your High Score: ${getLocalStorage("HIGHSCORE") ?? 0}`,
    40,
    330,
  );

  ctx.fillText("Press Enter to Restart", 70, 210);
}

const player = new Player(
  0,
  0,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  leftImg,
  rightImg,
  ctx,
);

function animate() {
  ctx.clearRect(0, 0, DIMENSIONS.CANVAS_WIDTH, DIMENSIONS.CANVAS_HEIGHT);

  switch (currentState) {
    case STATES[0]:
      start();
      break;
    case STATES[1]:
      play();
      break;
    case STATES[2]:
      end();
      break;
    default:
      break;
  }

  requestAnimationFrame(animate);
}

animate();
