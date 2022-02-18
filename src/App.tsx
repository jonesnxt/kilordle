import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';
import { Header, Keyboard, Puzzles } from './components';
import { checkValidity } from './util/checkValidity';
import { generateWordlist } from './util/generateWordlist';
import { sortByValue } from './util/sortByValue';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #F7F8F9;
`;

const Content = styled.div`
  max-width: 600px;
  box-shadow: 4px 4px 40px 4px rgba(0,0,0,0.2);
  background-color: #FFF;
  margin-bottom: 200px;
`;

function App() {
  const [wordlist, setWordlist] = useState(generateWordlist());
  const [guesslist, setGuesslist] = useState<string[]>([]);
  const [working, setWorking] = useState('');

  useEffect(() => {
    setWordlist(sortByValue(wordlist, guesslist));

  }, []);
  return (
    <div className="App">
      <Container>
        <Content>
          <Header remaining={wordlist.length} guesses={guesslist.length} />
          <Puzzles wordlist={wordlist} working={working} guesslist={guesslist} />
          <Keyboard onKeyPress={(key) => {
            if(key === '-') setWorking((tmp) => tmp.slice(0, tmp.length-1));
            else if(key === '+' && working.length === 5 && checkValidity(working)) {
              // lets go.
              const newGuesslist = guesslist.concat([working]);
              setGuesslist(newGuesslist);
              setWorking('');
              setWordlist(sortByValue(wordlist, newGuesslist));
            } else if(working.length !== 5) {
              setWorking((tmp) => tmp + key);
            }
          }}/>
        </Content>
      </Container>
    </div>
  );
}

export default App;
