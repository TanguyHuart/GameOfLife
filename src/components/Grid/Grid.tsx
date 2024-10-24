
import { useCallback, useEffect, useRef, useState} from "react";
import Square from "../Square/Square";
import "./Grid.css"
import { useRulesContext } from "@/context/RulesContext";
import {createGrid} from "@/functions/CreateGride";
import { useGridContext } from "@/context/GridContext";
import countNeighbors from "@/functions/CountNeighbors";

function Grid() {

  
const width = 20
const rows = 200
const cols = 200
const {lifeIsKeptWithMax, lifeIsKeptWithMin, lifeIsCreatedWith, interval, isRunning} = useRulesContext()
const { grid, setGrid} = useGridContext()
const bufferZone = 50;
const [offsetX, setOffsetX] = useState(0);
const [offsetY, setOffsetY] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
const gridRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  setGrid(createGrid(rows, cols))
}, [rows, cols, setGrid])


const toogleCell = useCallback((x : number,y : number) => {
  setGrid(prevGrid => {
    const newGrid = prevGrid.map(rows => [...rows])
    newGrid[x][y] = prevGrid[x][y] === 1 ? 0 : 1; // Inverser l'état
    return newGrid
  } )
}, [setGrid])



const nextGeneration = useCallback(() => {
  setGrid(prevGrid => {

    const newGrid = prevGrid.map(row => [...row]);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const aliveNeighbors = countNeighbors(prevGrid, i, j, rows, cols);
      const currentCell = prevGrid[i][j];
      
  
      // Règles du jeu de la vie
      if (currentCell === 1) {
        if (aliveNeighbors < lifeIsKeptWithMin || aliveNeighbors > lifeIsKeptWithMax) {
          newGrid[i][j] = 0; // Meurt
        } else {
          newGrid[i][j] = 1; // Reste vivante
        }
      } else {
        if (aliveNeighbors === lifeIsCreatedWith) {
          newGrid[i][j] = 1; // Devient vivante
        }
      }
    }
  }
  return newGrid
  })



}, [cols, grid, lifeIsCreatedWith, lifeIsKeptWithMax, lifeIsKeptWithMin, rows, setGrid])



useEffect(() => {
  let intervalId : number | undefined;

  if (isRunning) {
    intervalId = window.setInterval(nextGeneration, interval); // Démarrer l'intervalle si isRunning est vrai
  }

  return () => {
    if (intervalId !== undefined) {
      clearInterval(intervalId); // Arrêter l'intervalle lorsque isRunning devient faux ou lors du démontage
    }
  };
}, [isRunning, interval]);




const handleMouseDown = (e: React.MouseEvent) => {
  setIsDragging(true);
  setStartDrag({ x: e.clientX, y: e.clientY });
};

const handleMouseMove = (e: React.MouseEvent) => {
  if (isDragging) {
    const deltaX = e.clientX - startDrag.x;
    const deltaY = e.clientY - startDrag.y;
    setStartDrag({ x: e.clientX, y: e.clientY });
    setOffsetX(offsetX + deltaX);
    setOffsetY(offsetY + deltaY);

  }

};

const handleMouseUp = () => {
  setIsDragging(false);
};

  return (
    <div
    ref={gridRef}
  className="grid"
  style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${width}px)`,
    gridTemplateRows: `repeat(${rows}, ${width}px)`,
    transform: `translate(${offsetX}px, ${offsetY}px)`
  }}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
>
  {grid.map((row, i) => 
    row.map((cell, j) => <Square key={`${i},${j}`} onClick={() => toogleCell(i,j)} isAlive={cell === 1}/>))}
</div>
  );
}

export default Grid;