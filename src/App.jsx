import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import getWords from './words';

const BACKGROUND_COLOR = {
  clcp: '#538D4E', // correct letter and correct position
  clwp: '#B59F3B', // correct letter but wrong position
  wrong: '#3A3A3C',
};
const WORD_COUNT = 6;
const WORD_LENGTH = 5;

const StyledAppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #121213;
`;

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
  gap: 4px;
`;

const StyledBoardTile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border: 2px solid rgb(58,58,60);
  font-size: 40px;
  font-weight: bold;
  color: #FFFFFF;
  background-color: ${props => props.backgroundColor};
`;

function BoardRows({ userGuesses, wordToGuess, currentRow }) {
  const rows = userGuesses.map((val, rowIndex) => (
    Array.from({ length: WORD_LENGTH }).map((_, tileIndex) => {
      let tile;
      if (val === null) {
        tile = (
          <StyledBoardTile backgroundColor="transparent" key={tileIndex} />
        );
      } else {
        let backgroundColor;
        if (currentRow === rowIndex) {
          backgroundColor = 'transparent';
        } else if (val[tileIndex] === wordToGuess[tileIndex]) {
          backgroundColor = BACKGROUND_COLOR.clcp;
        } else if (wordToGuess.includes(val[tileIndex])) {
          backgroundColor = BACKGROUND_COLOR.clwp;
        } else {
          backgroundColor = BACKGROUND_COLOR.wrong;
        }
          
        tile = (
          <StyledBoardTile
            backgroundColor={backgroundColor}
            key={tileIndex}
            className={clsx(currentRow - 1 === rowIndex && 'rotate-animation')}
          >
            {val[tileIndex]}
          </StyledBoardTile>
        );
      }

      return tile;
    })
  ));

  return rows;
}

function App() {
  const [wordToGuess,setWordToGuess] = useState('');
  const [userGuessCounter, setUserGuessCounter] = useState(0);
  const [userGuesses, setUserGuesses] = useState(Array(WORD_COUNT).fill(null));
  

  useEffect(() => {
      const words = getWords();
      const wordToGuess = words[Math.floor(Math.random() * words.length)];
      setWordToGuess(wordToGuess);
  }, []);

  const keyboardHandler = e => {
    const charIsLetter = char => {
      if (typeof char !== 'string') {
        return false;
      }
    
      return /^[a-zA-Z]+$/.test(char);
    }

    let key = e.key;
    const userGuessCount = userGuessCounter;
    if (charIsLetter(key)) {
      key = key.toUpperCase();
      if (key.length === 1) {
        if (userGuesses[userGuessCount] === null) {
          setUserGuesses(prevState => {
            const newState = [...prevState];
            newState[userGuessCount] = key;
            

            return newState;
          })
        } else if (userGuesses[userGuessCount].length < WORD_LENGTH) {
          setUserGuesses(prevState => {
            const newState = [...prevState];
            newState[userGuessCount] = `${newState[userGuessCount]}${key}`;
            

            return newState;
          })
        }
      } else if (key.length > 0) {
        if (key === 'ENTER' && userGuessCount < WORD_COUNT) {
          setUserGuessCounter(prevState => prevState + 1);
        } else if (key === 'BACKSPACE') {
          if (userGuesses[userGuessCount].length > 0) {
            setUserGuesses(prevState => {
              const newState = [...prevState];
              newState[userGuessCount] = newState[userGuessCount].slice(0, -1);
  
              return newState;
            })
          }
        }
      }
    }
  };

  return (
    <StyledAppContainer tabIndex={0} onKeyDown={keyboardHandler}>
        <StyledBoard>
          <BoardRows userGuesses={userGuesses} wordToGuess={wordToGuess} currentRow={userGuessCounter} />
        </StyledBoard>
    </StyledAppContainer>
  );
}

export default App;