import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    setHistory([...history, { squares: nextSquares, position: i }]);
  }

  function handleSort() {
    setIsAscending(!isAscending);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const winningSquares = winner ? getWinningSquares(squares) : [];

  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (${Math.floor(step.position / 3) + 1}, ${
          (step.position % 3) + 1
        })`
      : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  function jumpTo(move) {
    setSquares(history[move].squares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>
        <button onClick={handleSort}>
          Sort Moves {isAscending ? "Descending" : "Ascending"}
        </button>
      </div>
      <div className="board">
        {Array(3)
          .fill(null)
          .map((_, row) => (
            <div key={row} className="board-row">
              {Array(3)
                .fill(null)
                .map((_, col) => {
                  const index = row * 3 + col;
                  return (
                    <Square
                      key={index}
                      value={squares[index]}
                      onSquareClick={() => handleClick(index)}
                      isWinningSquare={winningSquares.includes(index)}
                    />
                  );
                })}
            </div>
          ))}
      </div>
      <ol>{isAscending ? moves : moves.reverse()}</ol>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getWinningSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}
