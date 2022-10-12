import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';
import { Header, Keyboard, Puzzles, EndScreen } from './components';
import { checkValidity } from './util/checkValidity';
import { generateWordlist } from './util/generateWordlist';
import { sortByValue } from './util/sortByValue';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #f7f8f9;
`;

const Content = styled.div`
  max-width: 600px;
  box-shadow: 4px 4px 40px 4px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  margin-bottom: 200px;
`;

function App() {
  const totalWords = 1000;
  const [wordlist, setWordlist] = useState(generateWordlist(totalWords));
  const [guesslist, setGuesslist] = useState<string[]>([]);
  const [progressHistory, setProgressHistory] = useState<number[]>([]);
  const [working, setWorking] = useState('');

  const maxGuesses = 1005;
  const expired = guesslist.length >= maxGuesses;

  function addKey(key: string) {
    if (key === '-' || key === 'Backspace')
      setWorking((tmp) => tmp.slice(0, tmp.length - 1));
    else if (
      (key === '+' || key === 'Enter') &&
      working.length === 5 &&
      checkValidity(working)
    ) {
      // lets go.
      const newGuesslist = guesslist.concat([working]);
      setGuesslist(newGuesslist);
      setWorking('');
      setWordlist(sortByValue(wordlist, newGuesslist));
      setProgressHistory(
        progressHistory.concat([totalWords - (wordlist.length - 1)])
      );
    } else if (working.length !== 5 && key.length === 1 && key !== ' ') {
      setWorking((tmp) => tmp + key.toLowerCase());
    }
  }

  useEffect(() => {
    setWordlist(sortByValue(wordlist, guesslist));
  }, []);

  useEffect(() => {
    function keyEvent(ev: KeyboardEvent) {
      addKey(ev.key);
    }
    if (!expired) {
      window.addEventListener('keydown', keyEvent);
      if (working.length > 5) setWorking((tmp) => tmp.slice(0, 5));
      return () => window.removeEventListener('keydown', keyEvent);
    }
  }, [working]);

  function getUsedLetters() {
    var letters: string[] = [];
    guesslist.forEach((word) => {
      for (var i = 0; i < word.length; i++) {
        var char = word.charAt(i);
        if (letters.indexOf(char) === -1) letters.push(char);
      }
    });
    return letters;
  }

  // const endScreenDemo = true;
  // useEffect(() => {
  //   if (endScreenDemo) {
  //     let fakeProgressHistory = [];
  //     let progress = 0;
  //     while (progress < 1000) {
  //       progress += Math.floor(Math.random() * 10);
  //       fakeProgressHistory.push(progress);
  //     }
  //     setProgressHistory(fakeProgressHistory);
  //     setWordlist([]);
  //     setGuesslist(Array(fakeProgressHistory.length).fill('placeholder'));
  //   }
  // }, []);

  return (
    <div className="App">
      <Container>
        <Content>
          <Header
            guesses={guesslist.length}
            limit={maxGuesses}
            remaining={wordlist.length}
          />
          <Puzzles
            expired={expired}
            guesslist={guesslist}
            wordlist={wordlist}
            working={working}
          />
          {wordlist.length === 0 ? (
            <EndScreen progressHistory={progressHistory} />
          ) : null}
          <Keyboard
            expired={expired}
            onKeyPress={(key) => addKey(key)}
            usedLetters={getUsedLetters()}
          />
        </Content>
      </Container>
    </div>
  );
}

export default App;
