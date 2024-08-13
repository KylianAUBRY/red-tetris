import { ShowBoard } from "./components/plateau";

import React, { useEffect, useRef, useState } from 'react';

function App () {
  const subtractionOfDeltaTime = 50;
  const rows = 20;
	const cols = 10; 

  const [grid, setGrid] = useState (Array.from({ length: rows }, () => Array(cols).fill(null)));
  grid[19][9] = 'red';
	grid[19][8] = 'red';
	grid[19][7] = 'blue';
  grid[15][0] = 'blue';

  const [deltaTime, setDeltaTime] = useState(1000); // temps entre chaque changement de ligne en ms
  const deltaTimeRef = useRef(deltaTime);

  const [piece, setPiece] = useState({
    x: 0,
    y: 0,
    shape: [
      [null, 'blue', null],
      ['blue', 'blue', 'blue'],
      [null, null, null],
    ],
  })

  useEffect(() => {
    deltaTimeRef.current = deltaTime; // Met à jour la référence à chaque changement de deltaTime
  }, [deltaTime]);

  useEffect(() => {
    const decreaseInterval = setInterval(() => {
      setDeltaTime(prevDeltaTime => Math.max(100, prevDeltaTime - subtractionOfDeltaTime)); 
    }, 1000);
    return () => clearInterval(decreaseInterval); 
  }, []);

  function checkPiece(x, y) {

    var tmpPiece = {...piece};
    
    tmpPiece.x += x;
    tmpPiece.y += y;
    for (var tmpY = 0; tmpY < 3; tmpY++) {
      for (var tmpX = 0; tmpX < 3; tmpX++) {
        if ((tmpPiece.shape[tmpY][tmpX] && (tmpPiece.x + tmpX < 0 || tmpPiece.x + tmpX >= cols || tmpPiece.y + tmpY >= rows || grid[tmpPiece.y + tmpY][tmpPiece.x + tmpX]))) {
          if (tmpPiece.x + tmpX < 0)
            console.log(" < 0")
          if (tmpPiece.x + tmpX >= cols)
            console.log("cols")
          if (tmpPiece.y + tmpY >= rows)
            console.log("rows")
          return false;
        }
      }
    }
    return true;
  }


  useEffect(() => {
    const interval = setInterval(() => {
      if (checkPiece(0, 1) == true) {
        setPiece(prevPiece => ({
          ...prevPiece,
          y: prevPiece.y + 1
        }));
      }
    }, deltaTimeRef.current);

    return () => clearInterval(interval);
  }, [deltaTime]);
  

  useEffect(() => {
    const handleKeyDown = (event) => {

      if (event.key === 'ArrowLeft') {
        console.log(piece)
        if (checkPiece(-1, 0) == true) {
          setPiece(prevPiece => ({
            ...prevPiece,
            x: prevPiece.x - 1
          }));
        }
      } else if (event.key == 'ArrowUp') {
        console.log("up");
      } else if (event.key == 'ArrowRight') {
        if (checkPiece(1, 0) == true){
          setPiece(prevPiece => ({
            ...prevPiece,
            x: prevPiece.x + 1
          }));
        }
      } else if (event.key == 'ArrowDown') {
        setPiece(prevPiece => ({
          ...prevPiece,
          y: prevPiece.y + 1
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <ShowBoard grid={grid} piece={piece}/>
    </div>
  );
}



export default App;