'use client'

import { useEffect, useRef, useState } from "react";
import "./SavedPatternItem.css"
import { useGridContext } from "@/context/GridContext";
import { LocalStorage } from "@/utils/LocalStorage";
import { TPattern } from "@/@types";

type SavedPatternItemProps = {
  savedPattern : {
    name : string,
    grid : number[][]
  }
}

function SavedPatternItem({savedPattern} : SavedPatternItemProps) {
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cellSize = 10
  const {setSelectedSavePattern, selectedSavePattern} = useGridContext()
  const [patternIsSelected, setPatternIsSelected] = useState(false)

  const handleClickPattern = () => {
    setSelectedSavePattern (savedPattern)
    
  }

  const handleDeletePattern = () => {
    let patternList : TPattern[] = LocalStorage.getItem('savedPatterns')
    patternList = patternList.filter((pattern) => pattern.name !== savedPattern.name)
    LocalStorage.setItem('savedPatterns', patternList)
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {    
    if (selectedSavePattern?.name == savedPattern.name) {
      setPatternIsSelected (true)
    } 
    else {
      
      setPatternIsSelected(false)
    }
  }, [selectedSavePattern, savedPattern])

  useEffect(() => {

    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!savedPattern.grid) return
  
    // J'Efface le canvas avant de redessiner
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0 ; i < savedPattern.grid.length ; i++ ) {
      for (let j = 0 ; j < savedPattern.grid[i].length ; j++) {
        const x = j * cellSize 
        const y = i * cellSize
  
        ctx.fillStyle = savedPattern.grid[i][j] === 1 ? "white" : "black"
        ctx.fillRect (x, y, cellSize, cellSize)
        ctx.strokeStyle = 'rgb(61,61,61)'
        ctx.strokeRect(x, y , cellSize, cellSize)
      }
    }
  })

  if (!isClient) return null;

  return (
    <div className={`savedPatternItem ${patternIsSelected ? 'isSelected' : ''}` } onClick={handleClickPattern}>
      <p>{savedPattern.name}</p>
      <div className='canvas_container'>
        {savedPattern.grid && <canvas
          className='canvas'
          ref={canvasRef}
          width={savedPattern.grid[0].length * cellSize}
          height={savedPattern.grid.length * cellSize}
        />}
    </div>
    <div className="deleteButtonContainer">
          <button className="deleteButton" onClick={handleDeletePattern} type="button">X</button>
    </div>
  </div>
  );
}

export default SavedPatternItem;