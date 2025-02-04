export class GameBox {
  public state: boolean;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: Record<string, string> = {
    false: "black",
    true: "gray",
  };

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    state: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = state;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color[`${this.state}`];
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = "lightgray"; // Color for the border
    ctx.lineWidth = 0.1; // Adjust for thinner or thicker lines
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
