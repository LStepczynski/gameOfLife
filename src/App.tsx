import React from "react";

import styled from "styled-components";
import { GameBoard } from "./components/gameBoard";
import { Header } from "./components/header";

function App() {
  const [blockSize, setBlockSize] = React.useState(10);
  const [gameSize, setGameSize] = React.useState({
    width: Math.floor((window.innerWidth*0.95) / blockSize),
    height: Math.floor((window.innerHeight * 0.98) / blockSize),
  });

  // Temporary for build process
  if (false) {
    setBlockSize(20);
  }

  React.useEffect(() => {
    let previousWidth = window.innerWidth;
    let previousHeight = window.innerHeight;

    const intervalId = setInterval(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      if (currentWidth !== previousWidth || currentHeight !== previousHeight) {
        previousWidth = currentWidth;
        previousHeight = currentHeight;

        setGameSize({
          width: Math.floor((currentWidth * 0.95) / blockSize),
          height: Math.floor((currentHeight * 0.98) / blockSize),
        });
      }
    }, 500);

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [blockSize]);

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

export default App;
