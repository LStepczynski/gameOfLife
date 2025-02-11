import React from "react";

import styled from "styled-components";

import { GameOfLife } from "../../gameOfLife";

interface Props {
  width: number;
  height: number;
  boxSize: number;
}

export const GameBoard = ({ width, height, boxSize }: Props) => {
  const [simulating, setSimulating] = React.useState<boolean>(false);
  const [game, setGame] = React.useState<GameOfLife | null>(null);
  const [speed, setSpeed] = React.useState<number>(200);
  const gameCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const createGame = () => {
    const gameCanvas = gameCanvasRef.current;
    const gridCanvas = gridCanvasRef.current;

    if (gameCanvas && gridCanvas) {
      setGame(new GameOfLife(gameCanvas, gridCanvas, width, height, boxSize));
      setSimulating(false);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(1050 - Number(event.target.value));
  };

  React.useEffect(() => {
    let interval = null;

    if (game) {
      interval = setInterval(() => {
        if (simulating) {
          game.nextGeneration();
        }
      }, speed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [game, simulating, speed]);

  React.useEffect(() => {
    createGame();
  }, [width, height]);

  return (
    <GameContainer>
      <CanvasContainer width={width * boxSize} height={height * boxSize}>
        <GameCanvas
          id="game-canvas"
          width={width * boxSize}
          height={height * boxSize}
          onMouseDown={(e: any) => game?.handleMouseDown(e)}
          onMouseMove={(e: any) => game?.handleMouseMove(e)}
          onMouseLeave={() => game?.handleMouseLeave()}
          onMouseUp={() => game?.handleMouseUp()}
          ref={gameCanvasRef}
        />
        <GridCanvas
          id="grid-canvas"
          ref={gridCanvasRef}
          width={width * boxSize}
          height={height * boxSize}
        />
      </CanvasContainer>
      <ButtonContainer width={width * boxSize}>
        <input
          id="speed-slider"
          type="range"
          min="50"
          max="1000"
          step="50"
          value={1050 - speed}
          onChange={handleSpeedChange}
        />
        <Button onClick={() => game?.nextGeneration()}>
          <ButtonIcon src="rightArrowIcon.svg" />
        </Button>
        <Button onClick={() => setSimulating((value) => !value)}>
          <ButtonIcon src={simulating ? "pauseIcon.svg" : "playIcon.svg"} />
        </Button>
        <Button onClick={createGame}>
          <ButtonIcon src="refreshIcon.svg" />
        </Button>
      </ButtonContainer>
    </GameContainer>
  );
};

const ButtonIcon = styled.img`
  width: 100%;
`;

const Button = styled.div`
  width: 50px;
  padding: 10px;
  border: 2px solid white;
  border-radius: 15px;
`;

const ButtonContainer = styled.div<any>(
  ({ width }) => `
  width: ${width}px;
  display: flex;
  justify-content: end;
  gap: 30px;
  margin-right: 50px;
`
);

const CanvasContainer = styled.div<any>(
  ({ width, height }) => `
  position: relative;
  width: ${width}px;
  height: ${height}px;
`
);

const GridCanvas = styled.canvas<any>(
  ({ width, height }) => `
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  width: ${width}px;
  height: ${height}px;
`
);

const GameCanvas = styled.canvas<any>(({ width, height }) => [
  `
  position: absolute;
  top: 0;
  left: 0;
  width: ${width}px;
  height: ${height}px;
`,
]);

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  margin: 30px 0px;
`;
