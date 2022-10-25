import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
`;

const Title = styled.div`
  font-size: 18px;
  margin-right: 20px;
`;

const Stats = styled.div`
  font-size: 14px;
`;

function Header({
  remaining,
  guesses,
  limit,
}: {
  remaining: number;
  guesses: number;
  limit: number;
}) {
  return (
    <Container>
      <Title>
        Kilordle by{' '}
        <a href="https://github.com/jonesnxt/kilordle" target="_blank">
          jones
        </a>
        <a
          href="https://www.buymeacoffee.com/jonesnxt"
          style={{ paddingLeft: '8px', fontStyle: 'italic', fontSize: '12px' }}
          target="_black"
        >
          Buy me a coffee?
        </a>
      </Title>
      <Stats>
        Guesses: {guesses}/{limit} | Remaining: {remaining}/1000
      </Stats>
    </Container>
  );
}

export default Header;
