'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRulesContext } from "@/context/RulesContext";
import countNeighbors from "@/functions/CountNeighbors";
import { useGridContext } from "@/context/GridContext";
import { createCanvasGrid } from "@/functions/CreateGride";
import calculateVisibleCells from "@/functions/CalculateVisibleCells";

function CanvasGrid() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rows = 200; // Nombre initial de lignes
  const cols = 200; // Nombre initial de colonnes
  const bufferZone = 50; // Distance avant d'étendre la grille

  const { lifeIsKeptWithMax, lifeIsKeptWithMin, lifeIsCreatedWith, interval, isRunning } = useRulesContext();
  // État pour la grille et les décalages
  const {grid, setGrid, offsetX, setOffsetX, offsetY, setOffsetY, showGrid} = useGridContext()

  const [cellSize, setCellSize] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({width : 800, height : 600})


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
  }, [ lifeIsCreatedWith, lifeIsKeptWithMax, lifeIsKeptWithMin, setGrid])
  

  // Étendre la grille si nécessaire (vers la droite/bas)
  const extendGrid = () => {
    let newGrid = [...grid];
    const extendAmount = 10; // Nombre de lignes/colonnes à ajouter d'un coup

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const rightLimit = grid[0].length * cellSize + offsetX;
    const bottomLimit = grid.length * cellSize + offsetY;
    const leftLimit = offsetX;
    const topLimit = offsetY;

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

     // Ajouter des colonnes à gauche si nécessaire
  if (leftLimit > bufferZone) {
    newGrid = newGrid.map(row => [...Array(extendAmount).fill(0), ...row]);
    // Ajuster l'offset pour garder la grille en place
    setOffsetX(prevOffsetX => prevOffsetX - extendAmount * cellSize);
  }

  // Ajouter des lignes en haut si nécessaire
  if (topLimit > bufferZone) {
    for (let i = 0; i < extendAmount; i++) {
      const newRow = Array(newGrid[0].length).fill(0);
      newGrid.unshift(newRow); // Ajout en haut de la grille
    }
    // Ajuster l'offset pour garder la grille en place
    setOffsetY(prevOffsetY => prevOffsetY - extendAmount * cellSize);
  }
    setGrid(newGrid);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault(); // Empêcher le défilement par défaut

    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      // Zoom avant
      setCellSize(prevCellSize => Math.min(prevCellSize * zoomFactor, 100)); // Limite max de zoom
    } else {
      // Zoom arrière
      setCellSize(prevCellSize => Math.max(prevCellSize / zoomFactor, 5)); // Limite min de zoom
    }

    // Ajuster les offsets pour garder la position du curseur cohérente
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setOffsetX((prevOffsetX) => prevOffsetX - (mouseX - prevOffsetX) * (zoomFactor - 1));
    setOffsetY((prevOffsetY) => prevOffsetY - (mouseY - prevOffsetY) * (zoomFactor - 1));
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

  // Fonction pour récupérer les dimensions de la fenêtre (côté client)
  const updateCanvasDimensions = () => {
    if (typeof window !== "undefined") {
      setCanvasDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  };

  // Utiliser useEffect pour s'assurer que les dimensions sont mises à jour après le montage côté client
  useEffect(() => {
    updateCanvasDimensions(); // Initialement
    window.addEventListener("resize", updateCanvasDimensions); // Redimensionner le canvas en cas de changement de taille de la fenêtre

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellSize]);


  useEffect(() => {
    setGrid(createCanvasGrid(rows,cols))
  },[setGrid])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, interval]);

  // Mise à jour de la grille sur le canvas à chaque changement d'état
  useEffect(() => {
    // Fonction pour dessiner la grille sur le canvas
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // J'Efface le canvas avant de redessiner
    ctx.clearRect(0, 0, canvas.width, canvas.height);

const {startRow, endRow, startCol, endCol} = calculateVisibleCells(canvasRef, offsetX, offsetY, cellSize, grid)

    // Dessiner les cellules de la grille
    for (let i = startRow; i < endRow; i++) {
      for (let j = startCol; j < endCol; j++) {
        const x = j * cellSize + offsetX;
        const y = i * cellSize + offsetY;
        
        ctx.fillStyle = grid[i][j] === 1 ? "white" : "black";
        ctx.fillRect(x, y, cellSize, cellSize);
        if(showGrid) {
          ctx.strokeStyle =  'gray'; 
          ctx.strokeRect(x, y, cellSize, cellSize); // Contour de la cellule
        }

      }
    }
  };
    drawGrid();
  }, [grid, offsetX, offsetY, showGrid, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasDimensions.width} // Dimensions du canvas
      height={canvasDimensions.height} // Dimensions du canvas
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
