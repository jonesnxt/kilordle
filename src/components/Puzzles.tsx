import React from 'react';
import styled from 'styled-components';
import Puzzle from './Puzzle';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const More = styled.div`

`;

function Puzzles({wordlist, working, guesslist}: {wordlist: string[]; working: string; guesslist: string[]}) {
  return (
    <Container>
      {wordlist.slice(0, Math.min(wordlist.length, 32)).map((word) => (
        <Puzzle key={word} wordle={word} working={working} guesslist={guesslist} />
      ))}
      <More>+ {Math.max(0, wordlist.length - 32)} more</More>
    </Container>
  );
}

export default Puzzles;