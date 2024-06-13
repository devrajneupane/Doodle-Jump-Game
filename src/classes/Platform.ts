export default class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  imgSrc: string;
  ctx: CanvasRenderingContext2D;
  img: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    imgSrc: string,
    ctx: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.imgSrc = imgSrc;
    this.ctx = ctx;

    this.img = new Image();
    this.img.src = this.imgSrc;
  }

  draw() {
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}
