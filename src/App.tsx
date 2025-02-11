import React from "react";

import styled from "styled-components";
import { GameBoard } from "./components/gameBoard";
import { Header } from "./components/header";

function App() {
  const [blockSize, setBlockSize] = React.useState(10);
  const [gameSize, setGameSize] = React.useState({
    width: Math.floor((window.innerWidth * 0.9) / blockSize),
    height: Math.floor((window.innerHeight * 0.9) / blockSize),
  });

  // Temporary for build process
  if (false) {
    setBlockSize(20);
  }

  React.useEffect(() => {
    const handleResize = () => {
      setGameSize({
        width: Math.floor((window.innerWidth * 0.9) / blockSize),
        height: Math.floor((window.innerHeight * 0.9) / blockSize),
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppContainer>
      <Background />
      <Header />
      <GameBoard
        width={gameSize.width}
        height={gameSize.height}
        boxSize={blockSize}
      />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
`;

// Background with Gradient
const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #161a29;
  z-index: -10;
`;

// Game Container
const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  margin: 60px 0px;
`;

export default App;
