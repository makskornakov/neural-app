export function circle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
}