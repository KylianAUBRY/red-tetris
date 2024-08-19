import React from "react";
import "./MiniTetris.css";

export function MiniTetris({ grid, piece }) {

  return (
    <div className="mini-tetris-grid">
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
                className={`mini-tetris-cell`}
                style={{ "--piece-color": pieceCell || cell }}
              >
                {(pieceCell || cell) && <div className="inner-square"></div>}
              </div>
            );
          }),
        )}
    </div>
  );
}
