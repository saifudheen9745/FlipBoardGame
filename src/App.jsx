import { useEffect, useMemo, useState } from "react";

import "./App.css";
import Confetti from "react-confetti";

const gameIcons = [
  "🎉️",
  "🎎️",
  "🎁️",
  "🐸️",
  "🫖️",
  "🎈️",
  "🏆️",
  "⚽️",
  "🏀️",
  // "🎊️",
  // "🎖️",
  // "🥉️",
];

function App() {
  const [pieces, setPieces] = useState([]);

  const isGameCompleted = useMemo(
    () => pieces.length > 0 && pieces.every((piece) => piece.solved),
    [pieces]
  );

  const startGame = () => {
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    const newGameIcons = [];
    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }

    setPieces(newGameIcons);
  };

  const handleActive = (data) => {
    const flippedData = pieces.filter(
      (piece) => piece.flipped && !piece.solved
    );
    if (flippedData.length === 2) return;
    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPieces(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedPieces = pieces.filter(
      (piece) => piece.flipped && !piece.solved
    );
    if (flippedPieces.length === 2) {
      setTimeout(() => {
        if (flippedPieces[0].emoji === flippedPieces[1].emoji) {
          const solvedPieces = pieces.map((piece) => {
            if (
              piece.position === flippedPieces[0].position ||
              piece.position === flippedPieces[1].position
            ) {
              piece.solved = true;
            }
            return piece;
          });
          setPieces(solvedPieces);
        } else {
          const piecesToUnflip = pieces.map((piece) => {
            if (
              piece.position === flippedPieces[0].position ||
              piece.position === flippedPieces[1].position
            ) {
              piece.flipped = false;
            }
            return piece;
          });
          setPieces(piecesToUnflip);
        }
      }, 800);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    gameLogicForFlipped();
  }, [pieces]);

  return (
    <main>
      <h1 className="heading">Flip Board Game</h1>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${data.flipped ? "active" : ""}`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {isGameCompleted && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <div className="game-completed">
            <p className="zoom-in-text">YOU WINN!!!</p>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
