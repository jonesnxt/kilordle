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
  justify-content: space-around;
`;

const Key = styled.div`
  width: 40px;
  height: 40px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 10px;
`;

const rows = ['qwertyuiop','asdfghjkl','+zxcvbnm-'];

function Keyboard({ onKeyPress }: { onKeyPress: (key: string) => void}) {
  return (
    <Container>
      <Content>
        {rows.map((row) => (
          <Row key={row}>
            {row.split('').map((letter) => (
              <Key key={letter} onClick={() => onKeyPress(letter)}>{letter === '+' ? 'GO' : letter === '-' ? '<-' : letter}</Key>
            ))}

          </Row>
        ))}
      </Content>
    </Container>
  );
}

export default Keyboard;