import React from "react";

import styled from "styled-components";

import { GameOfLife } from "../../gameOfLife";

interface Props {
  width: number;
  height: number;
  boxSize: number;
}

export const GameBoard = ({ width, height, boxSize }: Props) => {
  const [game, setGame] = React.useState<GameOfLife | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setGame(new GameOfLife(canvas, ctx, width, height, boxSize));
      }
    }
  }, [width, height]);

  return (
    <StyledCanvas
      id="game-canvas"
      onMouseDown={(e: any) => game?.handleMouseDown(e)}
      onMouseMove={(e: any) => game?.handleMouseMove(e)}
      onMouseLeave={() => game?.handleMouseLeave()}
      onMouseUp={() => game?.handleMouseUp()}
      ref={canvasRef}
    />
  );
};

const StyledCanvas = styled.canvas<any>(({ width, height, boxSize }) => [
  `
  width: ${width * boxSize};
  height: ${height * boxSize};
`,
]);
