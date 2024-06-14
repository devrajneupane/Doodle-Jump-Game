import Platform from "./Platform.ts";
import { DIMENSIONS } from "../constants/constants.ts";

export default class MovingPlatform extends Platform {
  speedX: number;
  direction: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    imgSrc: string,
    ctx: CanvasRenderingContext2D,
    speedX: number,
  ) {
    super(x, y, width, height, imgSrc, ctx);

    this.speedX = speedX;
    this.direction = 1; // Direction (1 = right, -1 = left)
  }
  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      34,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  updatePosition() {
    this.x += this.speedX * this.direction;

    // Reverse direction after hitting edges
    if (this.x + this.width > DIMENSIONS.CANVAS_WIDTH) {
      this.direction = -1;
    } else if (this.x < 0) {
      this.direction = 1;
    }
  }
}
