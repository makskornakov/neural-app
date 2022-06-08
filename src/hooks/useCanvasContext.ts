import React, { useEffect, useState } from "react";

export function useCanvasContext(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext('2d')!);
  }, [canvasRef]);

  return [ctx, setCtx] as const;
}
