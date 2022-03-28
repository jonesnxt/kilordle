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

function Puzzles({expired, wordlist, working, guesslist}: {expired: boolean, wordlist: string[]; working: string; guesslist: string[]}) {
  const notShown = Math.max(0, wordlist.length - 32);
  return (
    <Container>
      {wordlist.slice(0, Math.min(wordlist.length, 32)).map((word) => (
        <Puzzle expired={expired} key={word} wordle={word} working={working} guesslist={guesslist} />
      ))}
      {wordlist.length > 0 ? <More>+ {notShown} more</More> : null }
    </Container>
  );
}

export default Puzzles;
