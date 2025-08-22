// Get CW CH scaling
export const getScaling = (canvas: HTMLCanvasElement) => ({
  cw: canvas.width / 1000,
  ch: canvas.height / 1000,
});
