import { useEffect, useRef } from "react";
import "./SavedPatternItem.css"

type SavedPatternItemProps = {
  savedPattern : {
    name : string,
    grid : number[][]
  }
}

function SavedPatternItem({savedPattern} : SavedPatternItemProps) {
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cellSize = 10

  useEffect(() => {

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

  return (
    <div className="savedPatternItem">
      <p>{savedPattern.name}</p>
      <div className='canvas_container'>
        {savedPattern.grid && <canvas
          className='canvas'
          ref={canvasRef}
          width={savedPattern.grid[0].length * cellSize}
          height={savedPattern.grid.length * cellSize}
        />}
    </div>
  </div>
  );
}

export default SavedPatternItem;