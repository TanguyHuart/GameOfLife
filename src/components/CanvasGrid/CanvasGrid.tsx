'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRulesContext } from "@/context/RulesContext";
import countNeighbors from "@/functions/CountNeighbors";
import { useGridContext } from "@/context/GridContext";
import { createCanvasGrid } from "@/functions/CreateGride";

function CanvasGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lifeIsKeptWithMax, lifeIsKeptWithMin, lifeIsCreatedWith, interval, isRunning } = useRulesContext();
  const cellSize = 20; // Taille de chaque cellule
  const rows = 200; // Nombre initial de lignes
  const cols = 200; // Nombre initial de colonnes
  const bufferZone = 50; // Distance avant d'étendre la grille
  const extendAmount = 10; // Nombre de lignes/colonnes à ajouter d'un coup

  // État pour la grille et les décalages
  const {grid, setGrid, offsetX, setOffsetX, offsetY, setOffsetY} = useGridContext()

  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  


  // Fonction pour gérer l'inversion de l'état d'une cellule
  const toggleCell = (x: number, y: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[y][x] = grid[y][x] === 1 ? 0 : 1;
    setGrid(newGrid);
  };

  const nextGeneration = useCallback(() => {
    setGrid(prevGrid => {
  
      const newGrid = prevGrid.map(row => [...row]);
      const currentRows = prevGrid.length;
      const currentCols = prevGrid[0].length;
    for (let i = 0; i < currentRows; i++) {
      for (let j = 0; j < currentCols; j++) {
        const aliveNeighbors = countNeighbors(prevGrid, i, j, currentRows, currentCols);
        const currentCell = prevGrid[i][j];
        
        // Règles
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
  

  // Étendre la grille si nécessaire (vers la droite/bas)
  const extendGrid = () => {
    let newGrid = [...grid];

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const rightLimit = grid[0].length * cellSize + offsetX;
    const bottomLimit = grid.length * cellSize + offsetY;

    if (rightLimit < width + bufferZone) {
      // Ajouter des colonnes à chaque ligne
      newGrid = newGrid.map(row => [...row, ...Array(extendAmount).fill(0)]);
    }

    if (bottomLimit < height + bufferZone) {
      // Ajouter des lignes
      for (let i = 0; i < extendAmount; i++) {
        const newRow = Array(newGrid[0].length).fill(0);
        newGrid.push(newRow);
      }
    }

    setGrid(newGrid);
  };

  // Gestion du clic pour inverser l'état des cellules
  const handleCanvasClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor((e.clientX - rect.left - offsetX) / cellSize);
    const y = Math.floor((e.clientY - rect.top - offsetY) / cellSize);

    if (x >= 0 && y >= 0 && x < grid[0].length && y < grid.length) {
      toggleCell(x, y);
    }
  };

  // Gestion du drag pour déplacer la grille
  const handleMouseDown = (e: React.MouseEvent) => {

    if(e.button === 2) {
      e.preventDefault()
    setIsDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
  }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startDrag.x;
      const deltaY = e.clientY - startDrag.y;
      setStartDrag({ x: e.clientX, y: e.clientY });
      setOffsetX(offsetX + deltaX);
      setOffsetY(offsetY + deltaY);
      extendGrid(); // Étendre la grille si on approche des bords
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setGrid(createCanvasGrid(rows,cols))
  },[])

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

  // Mise à jour de la grille sur le canvas à chaque changement d'état
  useEffect(() => {
    // Fonction pour dessiner la grille sur le canvas
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions du canvas
    const width = canvas.width;
    const height = canvas.height;

    // Effacer le canvas avant de redessiner
    ctx.clearRect(0, 0, width, height);

    // Dessiner les cellules de la grille
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const x = j * cellSize + offsetX;
        const y = i * cellSize + offsetY;
        ctx.fillStyle = grid[i][j] === 1 ? "white" : "black";
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = 'gray'
        ctx.strokeRect(x, y, cellSize, cellSize); // Contour de la cellule
      }
    }
  };
    drawGrid();
  }, [grid, offsetX, offsetY]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth} // Dimensions du canvas
      height={window.innerHeight} // Dimensions du canvas
      style={{ backgroundColor : "black", cursor: isDragging ? "grabbing" : "grab" }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    />
  );
}

export default CanvasGrid;
