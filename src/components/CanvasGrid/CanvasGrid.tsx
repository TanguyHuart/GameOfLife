'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRulesContext } from "@/context/RulesContext";
import countNeighbors from "@/functions/CountNeighbors";
import { useGridContext } from "@/context/GridContext";
import { createCanvasGrid } from "@/functions/CreateGride";
import calculateVisibleCells from "@/functions/CalculateVisibleCells";
import './CanvasGrid.css'
import ConfirmSelectedPattern from "../ConfirmSelectedPattern/ConfirmSelectedPattern";

function CanvasGrid() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rows = 200; // Nombre initial de lignes
  const cols = 200; // Nombre initial de colonnes
  const bufferZone = 10; // Distance avant d'étendre la grille
  const dragBuffer = 10
  // Etat pour les règes du jeu
  const { lifeIsKeptWithMax, lifeIsKeptWithMin, lifeIsCreatedWith, interval, isRunning } = useRulesContext();
  // État pour la grille et les décalages
  const {grid, setGrid, offsetX, setOffsetX, offsetY, setOffsetY, showGrid, savedGrid, zoom, selectionMode, selectedSavePattern, setSelectedSavePattern} = useGridContext()
  const [cellSize, setCellSize] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({width : 800, height : 600})

  
  const [startSelectArea, setStartSelectedArea] = useState<{x : number, y : number} | null> (null)
  const  [endSelectArea, setEndSelectArea] = useState<{x : number, y : number} | null>(null)
  const [selectedGrid, setSelectedGrid] = useState<number[][] | null>(null)
const [cursorRectPosition, setCursorRectPosition] = useState<{x : number, y : number} | null>(null)
  


  // Fonction pour gérer l'inversion de l'état d'une cellule
  const toggleCell = (x: number, y: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[y][x] = grid[y][x] === 1 ? 0 : 1;
    setGrid(newGrid);
  };

const getRectPosition = (event : React.MouseEvent | React.TouchEvent) => {
  const canvas = canvasRef.current
  if (!canvas) return {x : 0,y : 0}
  const {clientX , clientY} = 'touches' in event ? event.changedTouches[0] : event;

  const rect = canvas.getBoundingClientRect();

  const x = Math.floor((clientX - rect.left - offsetX) / cellSize);
  const y = Math.floor((clientY - rect.top - offsetY) / cellSize);

  return {x,y}
}

const saveSelection = () => {

  if (startSelectArea && endSelectArea) {
  const startX = Math.min (startSelectArea?.x, endSelectArea.x )
  const startY = Math.min (startSelectArea.y, endSelectArea.y)
  const endX = Math.max(startSelectArea.x,  endSelectArea.x)
  const endY = Math.max( startSelectArea.y, endSelectArea.y)

  const pattern = []
  for (let i = startY; i <= endY; i++) {
    pattern.push(grid[i].slice(startX, endX + 1));
  }  
  setSelectedGrid(pattern)
  setStartSelectedArea(null)
  setEndSelectArea(null)

}
else {
  setEndSelectArea(null)
  setStartSelectedArea(null)
  setSelectedGrid(null)
}

}

const insertSavedPattern = (pattern:number[][], x: number, y: number) => {
  const newGrid = grid.map(row => [...row]);
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const newY = y + i;
      const newX = x + j;
      if (newY >= 0 && newY < newGrid.length && newX >= 0 && newX < newGrid[0].length) {    
        if (pattern[i][j] === 1 && newGrid[newY][newX] === 0) {
          newGrid[newY][newX] = pattern[i][j];
        }
      }
    }
  }
  setGrid(newGrid);
}

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


  // Gestion du clic pour inverser l'état des cellules
const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent ) => {
  e.preventDefault()
  const x = getRectPosition(e).x
  const y = getRectPosition(e).y
  if (x >= 0 && y >= 0 && x < grid[0].length && y < grid.length) {      
    toggleCell(x, y);
  }
};

  // Gestion du drag pour déplacer la grille
const handleMouseDown = (e: React.MouseEvent ) => {
  if (e.button === 2) {
    setIsMouseDown(true)
    setIsDragging(false);
    const {clientX , clientY} =  e;
    setStartDrag({ x: clientX, y: clientY });
  }
  if (e.button === 0 && selectionMode ) {
    setIsMouseDown(true)
    setStartSelectedArea(getRectPosition(e))
  }
}

const handleTouchStart = (e : React.TouchEvent) => {
  setIsMouseDown(true)

  if (!selectionMode) {
    setIsDragging (false)
    const {clientX , clientY} =  e.touches[0]
    setStartDrag({x: clientX, y: clientY })
  }
  else {
    setStartSelectedArea(getRectPosition(e))
  }  
}



const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {

setCursorRectPosition(getRectPosition(e))

  if (!isMouseDown ) {
    return
  }
  const {clientX , clientY} = 'touches' in e ? e.touches[0] : e;
  const deltaX = clientX - startDrag.x;
  const deltaY = clientY - startDrag.y;

  if ( Math.abs(deltaX) > dragBuffer || Math.abs(deltaY) > dragBuffer) {    
    setIsDragging(true);
    setSelectedSavePattern(null)
  }

  if ('button' in e && e.buttons !== 2) {
    setIsDragging(false)
  }
  
  if (selectionMode) {   
    setEndSelectArea(getRectPosition(e))
  }

  if (isDragging) {
      setStartDrag({ x: clientX, y: clientY });
      setOffsetX(offsetX + deltaX);
      setOffsetY(offsetY + deltaY);
      extendGrid(); // Étendre la grille si on approche des bords
    }
  };

  const handleMouseUp = (e: React.MouseEvent ) => {
    setIsMouseDown(false)

    if (!isDragging && !selectionMode) {      
      handleCanvasClick(e)
    }
    if (selectionMode && selectedSavePattern) {
      setStartSelectedArea(null)
      setEndSelectArea(null)
      const {x, y} = getRectPosition(e)
      insertSavedPattern(selectedSavePattern.grid, x, y  )
    }
    if (selectionMode && startSelectArea && endSelectArea) {
      saveSelection()      
    }
    setIsDragging(false);
  };

  const handleTouchEnd = (e : React.TouchEvent) => {
    setIsMouseDown(false)

    if (!isDragging && !selectionMode) {      
      handleCanvasClick(e)
    }
    if ( selectionMode) {
      saveSelection()
    }
    setIsDragging(false)
  }



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
    setGrid(createCanvasGrid(rows,cols, savedGrid))
  },[setGrid, savedGrid])

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
        
          if (grid[i][j] === 1) {
            ctx.fillStyle = "white"
            ctx.fillRect(x, y, cellSize, cellSize);
          }
          else if(showGrid && cellSize > 10) {
            ctx.strokeStyle =  'rgb(61, 61, 61)'; 
            ctx.strokeRect(x, y, cellSize, cellSize); // Contour de la cellule
          }
        }
      }

      if (cursorRectPosition) {  
        const x = cursorRectPosition.x * cellSize + offsetX;
        const y = cursorRectPosition.y * cellSize + offsetY;
        ctx.strokeStyle = "white"
        ctx.strokeRect(x, y, cellSize, cellSize)
      }

      if (startSelectArea && endSelectArea && selectionMode) {
        const x = startSelectArea.x * cellSize + offsetX;
        const y = startSelectArea.y * cellSize + offsetY;
        const width = (endSelectArea.x - startSelectArea.x + 1) * cellSize;
        const height = (endSelectArea.y - startSelectArea.y + 1) * cellSize;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }
    };
    drawGrid ()
  }, [grid, offsetX, offsetY, showGrid, cellSize, startSelectArea, endSelectArea, cursorRectPosition]);

  useEffect(() => { 
    const handleZoom = (zoom : number) => {
      const minCellSize = 5;   // Taille de cellule minimale
      const maxCellSize = 100; // Taille de cellule maximale
      // Calcul de la taille de cellule en fonction de zoom, proportionnellement entre min et max
      const newCellSize = minCellSize + (maxCellSize - minCellSize) * (zoom - 1);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = window.innerWidth / 2 - rect.left;
      const mouseY = window.innerHeight / 2 - rect.top;
      setOffsetX((prevOffsetX) => (mouseX - (mouseX - prevOffsetX) * (newCellSize / cellSize)));
      setOffsetY((prevOffsetY) => (mouseY - (mouseY - prevOffsetY) * (newCellSize / cellSize)));
      setCellSize(newCellSize);
    }
    handleZoom(zoom)
  }, [zoom, setOffsetX, setOffsetY, cellSize ])

  return (
    <>
    <canvas
      ref={canvasRef}
      width={canvasDimensions.width} // Dimensions du canvas
      height={canvasDimensions.height} // Dimensions du canvas
      style={{ backgroundColor : "black", cursor: isDragging ? "grabbing" : "" }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={()=> setCursorRectPosition(null)}


    />
    {selectedGrid && <ConfirmSelectedPattern pattern={selectedGrid} setPattern={setSelectedGrid} />}
    </>
  );
}

export default React.memo(CanvasGrid);
