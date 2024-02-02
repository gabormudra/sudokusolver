import React, { useEffect, useState } from 'react';
import InputField from './components/InputField/InputField';
import './App.css';

const defaultCellValues: number[] = [];

for (let i = 0; i < 81; i++){
  defaultCellValues[i] = -1;
}

function getRowElements(cellValues: number[], cellRow: number): number[] {
  const rowElements = cellValues.filter((item, index) => {
    const rowStart = (cellRow - 1) * 9 + 1;
    return (index + 1 >= rowStart && index + 1 <= (rowStart + 8));
  });

  return rowElements;
}

function getColumnElements(cellValues: number[], cellColumn: number): number[] {
  const rowStarts: number[] = [1, 10, 19, 28, 37, 46, 55, 64, 73].map(item => item + cellColumn - 1);

  const columnElements = cellValues.filter((item, index) => {
    return rowStarts.indexOf(index + 1) !== -1;
  });

  return columnElements;
}

const findDuplicates = (arry: number[]) => arry.filter((item, index) => {
  if (item !== -1) {
    return arry.indexOf(item) !== index;
  }

  return false;
});

function checkBoard(cellValues: number[]): boolean {
  for (let i = 1; i <= 9; i++) {
    const rowElements = getRowElements(cellValues, i);
    const columnElements = getColumnElements(cellValues, i);

    if (findDuplicates(rowElements).length > 0) return false;
    if (findDuplicates(columnElements).length > 0) return false;
  }

  for (let row = 1; row <= 9; row = row + 3) {
    for (let column = 1; column <= 9; column = column + 3) {
      const subTableElements = get3x3Cell(cellValues, row, column);

      if (findDuplicates(subTableElements).length > 0) return false;
    }
  }

  return true;
}

function get3x3Cell(cellValues: number[], cellRow: number, cellColumn: number): number[] {
  const startNumbers = [1,1,1,4,4,4,7,7,7];

  const cellStartRow = startNumbers[cellRow-1];
  const cellStartColumn = startNumbers[cellColumn-1];

  const cells3x3: number[] = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      cells3x3.push(cellValues[(cellStartRow - 1 + i) * 9 + (cellStartColumn - 1 + j)]);
    }
  }

  return cells3x3;
}

function getPossibleNumbers(cellValues: number[], cellRow: number, cellColumn: number): number[] {
  const rowElements = getRowElements(cellValues, cellRow);
  const columnElements = getColumnElements(cellValues, cellColumn);

  const cells3x3: number[] = get3x3Cell(cellValues, cellRow, cellColumn);

  /*
  console.log(rowElements);
  console.log(columnElements);
  console.log(cells3x3);

  */

  const possibleNumbers: number[] = [];

  for (let i = 1; i <= 9; i++) {
    if (
      rowElements.indexOf(i) === -1 &&
      columnElements.indexOf(i) === -1 &&
      cells3x3.indexOf(i) === -1
    ) {
      possibleNumbers.push(i);
    }
  }

  return possibleNumbers;
}

function App() {
  const [cellValues, setCellValues] = useState(defaultCellValues);
  const [solving, setSolving] = useState(false);
  const cells: number[] = [];

  for (let i = 1; i <= 9; i++) {
    cells.push(i);
  }

  const startSolving = () => {
    setSolving(true);
  }

  const refreshCellValues = (inputFieldId: string, value: any) => {
    const cellNumber = parseInt(inputFieldId.replace('cell-', ''));
    const newArray: number[] = JSON.parse(JSON.stringify(cellValues));
    if (isNaN(parseInt(value))) {
      newArray[cellNumber-1] = -1;
    } else {
      newArray[cellNumber-1] = parseInt(value);
    }

    setCellValues(newArray);
  }

  const resetBoard = () => {
    const newArray: number[] = [];

    for (let i = 0; i < 81; i++) {
      newArray[i] = -1;
    }

    setCellValues(newArray);
  }

  useEffect(() => {
    if (solving) {
      if (cellValues.indexOf(-1) === -1) {
        setSolving(false);
      }

      const possibleNumbersForCells: Array<Array<number>> = [];

      for (let i = 0; i < 81; i++) {
        const row = Math.ceil((i+1)/9);
        const column = (i+1) % 9;

        if (cellValues[i] === -1) {
          possibleNumbersForCells[i] = getPossibleNumbers(cellValues, row, column);
        } else {
          possibleNumbersForCells[i] = [cellValues[i]];
        }

        if (possibleNumbersForCells[i].length === 0) {
          // No solution for this board
          console.log("No solution");
        }
      }

      let changePresent = false;
      const newArray: number[] = JSON.parse(JSON.stringify(cellValues));

      for (let i = 0; i < 81; i++) {
        if (possibleNumbersForCells[i].length === 1 && possibleNumbersForCells[i][0] !== cellValues[i]) {
          changePresent = true;
          newArray[i] = possibleNumbersForCells[i][0];
        }
      }

      if (changePresent) {
        setCellValues(newArray);
      }
    }
  }, [cellValues, solving]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Sudoku megoldó szoftverecske
        </div>
        <div>
          <img src='/header_photos.jpg' alt="Győztes csapat" />
        </div>
      </header>
      <div className='sudokuTable'>
        {
          cells.map(row => {
            return (
              <div className="row" key={row}>
              {
                cells.map(column => {
                  const cellNumber = (row-1) * 9 + column;
                  return (
                    <div className="column" key={`${row}${column}`}>
                      <InputField
                        id={`cell-${cellNumber}`}
                        value={cellValues[cellNumber-1] !== -1 ? cellValues[cellNumber-1] : -1}
                        valueChanged={refreshCellValues}
                      />
                    </div>
                  )
                })
              }
              </div>
            );
          })
        }
      </div>
      <div className='solveButtonContainer'>
        <button
          onClick={startSolving}
          disabled={!checkBoard(cellValues)}
        >Solve</button>
        <button
          onClick={resetBoard}
        >Reset</button>
      </div>
      { !checkBoard(cellValues) &&
      <div>There are no solutions for this board, there are same numbers in a row, column, or sub-table.</div>
      }
    </div>
  );
}

export default App;
