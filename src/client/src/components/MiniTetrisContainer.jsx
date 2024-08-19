import React from "react";
import "./MiniTetrisContainer.css"
import { MiniTetris } from "./MiniTetris";

import { useSelector } from "react-redux";
import { selectGrid } from "../reducers/board";
import { selectPiece } from "../reducers/piece";

export function MiniTetrisContainer({ playerCount}) {
	console.log('playerCount:', playerCount);
  const grid = useSelector(selectGrid);
  const piece = useSelector(selectPiece);

  return (
    <div className="mini-game-box">
      {Array.from({ length: playerCount }).map((_, index) => (
            <MiniTetris key={index} grid={grid} piece={piece}/>
          ))}
      
      {/* <MiniTetris /> */}
		
    </div>
  );
}
