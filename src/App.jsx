import { ShowBoard } from "./components/plateau";
import React, { useEffect, useRef, useState } from 'react';

function App () {
  const rows = 20;
	const cols = 10;
  // const [grid, setGrid] = useState (Array.from({ length: rows }, () => Array(cols).fill(null)));
  // const gridRef = useRef(grid);

  // useEffect(async () => {
  //   // if (grid)
  //   //   ;
  // }, [grid]);

  
  return (
    <div>
      <ShowBoard />
    </div>
  );
}

export default App;