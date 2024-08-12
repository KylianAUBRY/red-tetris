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
        if (tmpPiece.y + tmpY >= rows || (tmpPiece.shape[tmpY][tmpX] && grid[tmpPiece.y + tmpY][tmpPiece.x + tmpX])) {
          
          return 1;
        }
      }
    }
    return 0;
  }




  useEffect(() => {
    const interval = setInterval(() => {
      if (checkPiece(0, 1) == 1)
        return ;
      setPiece(prevPiece => ({
        ...prevPiece,
        y: prevPiece.y + 1
      }));
    }, deltaTimeRef.current);

    return () => clearInterval(interval);
  }, [deltaTime]);
  
  return (
    <div>
      <ShowBoard grid={grid} piece={piece}/>
    </div>
  );
}

export default App;