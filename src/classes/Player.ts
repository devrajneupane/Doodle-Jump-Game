import { DIMENSIONS, GRAVITY, SPEED } from "../constants.ts";

export default class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  leftImgSrc: string;
  rightImgSrc: string;
  ctx: CanvasRenderingContext2D;
  grounded: boolean;
  dead: boolean;
  img: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    leftImgSrc: string,
    rightImgSrc: string,
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;

    this.grounded = false;
    this.dead = false;

    this.leftImgSrc = leftImgSrc;
    this.rightImgSrc = rightImgSrc;
    this.img = new Image();
    this.img.src = this.leftImgSrc;
  }

  draw() {
    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.img.src = this.leftImgSrc;
    this.x -= SPEED;

    if (this.x < 0) {
      this.x = DIMENSIONS.CANVAS_WIDTH;
    }
  }

  moveRight() {
    this.img.src = this.rightImgSrc;
    this.x += SPEED;

    if (this.x + this.width > DIMENSIONS.CANVAS_WIDTH) {
      this.x = 0;
    }
  }

  jump() {
    this.y -= SPEED;
  }

  fall() {
    this.y += GRAVITY;
  }

  die() {
    this.dead = true;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
