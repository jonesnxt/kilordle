import React from 'react';
import styled from 'styled-components';

import { checkValidity } from '../util/checkValidity';
import { isYellow } from '../util/isYellow';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2px;
  margin: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Letter = styled.div<{ green?: boolean; yellow?: boolean; red?: boolean }>`
  display: flex;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #f7f8f9;
  align-items: center;
  justify-content: center;

  ${({ yellow }) => yellow && 'background-color: #FFFF00;'}
  ${({ green }) => green && 'background-color: #00C800;'}
  ${({ red }) => red && 'background-color: #DE5956;'}
`;

function Puzzle({
  expired,
  wordle,
  working,
  guesslist,
}: {
  expired: boolean;
  wordle: string;
  working: string;
  guesslist: string[];
}) {
  return (
    <Container>
      {guesslist.map((guess, gnum) => (
        <Row key={guess}>
          {guess.split('').map((letter, i) => (
            <Letter
              green={letter === wordle[i]}
              key={`${letter}${i},${gnum}`}
              yellow={isYellow(wordle, guess, i)}
            >
              {letter}
            </Letter>
          ))}
        </Row>
      ))}
      {!expired && (
        <Row>
          {working.split('').map((letter, i) => (
            <Letter
              key={`${letter}${i}W`}
              red={working.length === 5 && !checkValidity(working)}
            >
              {letter}
            </Letter>
          ))}
          {working.length <= 5 &&
            Array.from(Array(5 - working.length)).map((e, i) => (
              <Letter key={`empty-${i}`}> </Letter>
            ))}
        </Row>
      )}
    </Container>
  );
}

export default Puzzle;
