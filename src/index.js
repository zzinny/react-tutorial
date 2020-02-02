import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        // To save typing and avoid 'confusing behavior of this', we will use arrow funcion. 
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const rows = [];
        for (let i=0; i<3; ++i) {
            const squares = [];
            for (let j=0; j<3; ++j) {
                squares.push(this.renderSquare(i*3+j));
            }
            rows.push(<div className="board-row">{squares}</div>);
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: Array(2).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const location = getLocation(i);
        this.setState({
            history: history.concat([{
                squares: squares,
                location: location,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleSortButton() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            if (!this.state.isAscending) {
                move = history.length - move - 1;
            }
            const desc = move ?
            'Go to move #' + move :
            'Go to game start';
            const squares = history[move];
            const location = '(' + squares.location[0] + ', ' + squares.location[1] + ')';
            let isCurrentStep = false;
            if (move === this.state.stepNumber) {
                isCurrentStep = true;
            }
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={isCurrentStep ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
                    >
                        {desc}{location}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let sortButtonText = this.state.isAscending ? 'sort in descending' : 'sort in ascending';

        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <div><button onClick={() => this.handleSortButton()}>{sortButtonText}</button></div>
                <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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

function getLocation(i) {
    // 0 1 2 / 3 4 5 / 6 7 8
    const row = Math.floor(i / 3);
    const col = i % 3;
    const location = [row, col];
    return location;
}