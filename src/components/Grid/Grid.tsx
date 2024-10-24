
import { useCallback, useEffect, useState } from "react";
import Square from "../Square/Square";
import "./Grid.css"
import { useRulesContext } from "@/context/RulesContext";
import createGrid from "@/functions/CreateGride";
import { useGridContext } from "@/context/GridContext";
import countNeighbors from "@/functions/CountNeighbors";

function Grid() {

  
const width = 20
const rows = Math.floor(window.innerHeight / width)
const cols = Math.floor(window.innerWidth / width)
const {lifeIsKeptWithMax, lifeIsKeptWithMin, lifeIsCreatedWith, interval, isRunning} = useRulesContext()
const { grid, setGrid} = useGridContext()

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

  return (
    <div
  className="grid"
  style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${width}px)`,
    gridTemplateRows: `repeat(${rows}, ${width}px)`,
  }}
>
  {grid.map((row, i) => 
    row.map((cell, j) => <Square key={`${i},${j}`} onClick={() => toogleCell(i,j)} isAlive={cell === 1}/>))}
</div>
  );
}

export default Grid;