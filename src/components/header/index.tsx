import styled from "styled-components";

import { AnimatedText } from "../general/animatedText";

export const Header = () => {
  const handleScroll = () => {
    document
      .getElementById("game-canvas")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MainContainer>
      <Title>
        Conway's Game of <AnimatedText>Life</AnimatedText>
      </Title>
      <div>
        <PlayButton onClick={handleScroll}>Play now ⬇️</PlayButton>
      </div>
      <SectionContainer>
        <SectionTitle>What is it?</SectionTitle>
        <SectionBody>
          The Game of Life is a computer simulation that shows how patterns
          change over time on a grid. Starting with a simple setup, the shapes
          can grow, move, or disappear in surprising ways. Even though it’s easy
          to set up, it can create complex and interesting designs.
        </SectionBody>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>How to play?</SectionTitle>
        <SectionBody>
          Conway's Game of Life is a cellular automaton where each cell on a
          grid can be either alive or dead, evolving through discrete time steps
          based on simple rules. A live cell survives to the next generation if
          it has two or three live neighbors; otherwise, it dies from
          underpopulation or overpopulation. A dead cell becomes alive if it has
          exactly three live neighbors, simulating reproduction, and this cycle
          continues, creating complex patterns from simple beginnings.
        </SectionBody>
      </SectionContainer>
    </MainContainer>
  );
};

const SectionTitle = styled.h2`
  font-family: "Press Start 2P", cursive;
  font-size: 32px;
`;

const SectionBody = styled.p`
  font-family: "VT323", cursive;
  font-size: 28px;
  line-height: 1.3;
  text-align: justify;
`;

const SectionContainer = styled.div`
  margin-top: 100px;
`;

const PlayButton = styled.button`
  font-family: "Press Start 2P", cursive;
  font-size: 22px;
  padding: 20px 20px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4338ca;
  }
`;

const Title = styled.h1`
  font-family: "Press Start 2P";
  font-size: 48px;
  line-height: 1.6;
`;

const MainContainer = styled.div`
  width: 50%;
  display: grid;
  justify-content: center;
  margin-top: 200px;
  margin-bottom: 100px;
`;
