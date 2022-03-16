import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #FFF;
  padding: 12px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Key = styled.div<{letter: string, used: boolean}>`
  width: ${({ letter }) => (letter === '+') ? '55px' : '40px'};
  height: 40px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: #EEE;
  }

  
  ${({ used }) => used && `
    background-color: #EEE;  
  `}
`;

const rows = ['qwertyuiop','asdfghjkl','+zxcvbnm-'];

function Keyboard({ expired, usedLetters, onKeyPress }: { expired: boolean, usedLetters: string[], onKeyPress: (key: string) => void }) {
  if(expired) {
      return (
        <Container>
          <Content>
            No more guesses. Why have you done this to yourself?
          </Content>
        </Container>
      );
  } else {
      return (
        <Container>
          <Content>
            {rows.map((row) => (
              <Row key={row}>
                {row.split('').map((letter) => (
                  <Key used={usedLetters.indexOf(letter)!==-1} key={letter} letter={letter} onClick={() => onKeyPress(letter)}>{letter === '+' ? 'GO' : letter === '-' ? '⌫' : letter}</Key>
                ))}

              </Row>
            ))}
          </Content>
        </Container>
      );
  }
}

export default Keyboard;
