import styled, { keyframes, css } from "styled-components";

interface Props {
  sx?: string;
  children: string;
}

export const AnimatedText = (props: Props) => {
  const { sx, children } = props;

  return (
    <TextContainer>
      {Array.from(children).map((letter: string, index: number) => (
        <AnimatedLetter key={index} delay={index * 0.2} sx={sx}>
          {letter}
        </AnimatedLetter>
      ))}
    </TextContainer>
  );
};

const TextContainer = styled.div`
  display: inline-block;
`;

// Keyframes for up-and-down motion
const bounce = keyframes`
  0%, 100% {
    transform: translateY(6px);
  }
  50% {
    transform: translateY(-6px);
  }
`;

// AnimatedLetter with staggered animation delay
const AnimatedLetter = styled.span<{ delay: number; sx?: string }>`
  display: inline-block;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;

  ${(props) =>
    props.sx &&
    css`
      ${props.sx}
    `}
`;
