import React from "react";

import { useSelector } from "react-redux";
import { selectGrid } from "../reducers/board";
import { selectPiece } from "../reducers/piece";

export function ShowBoard() {
  const grid = useSelector(selectGrid);
  const piece = useSelector(selectPiece);

  return (
    <div className="game-box">
      <div className="tetris-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const tmpY = rowIndex - piece.y;
            const tmpX = colIndex - piece.x;
            var pieceCell = null;
            if (tmpY >= 0 && tmpX >= 0 && tmpY < 3 && tmpX < 3) {
              pieceCell = piece.shape[tmpY][tmpX];
            }
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tetris-cell`}
                style={{ "--piece-color": pieceCell || cell }}
              >
                {(pieceCell || cell) && <div className="inner-square"></div>}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
