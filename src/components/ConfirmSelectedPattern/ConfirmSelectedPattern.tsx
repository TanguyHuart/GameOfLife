import { useEffect, useRef, useState } from 'react'
import './ConfirmSelectedPattern.css'
import { LocalStorage } from '@/utils/LocalStorage'
import { TPattern } from '@/@types'


type ConfirmSelectedPatternProps = {
  pattern : number[][] | null
  setPattern : React.Dispatch<React.SetStateAction<number[][] | null>>
}



function ConfirmSelectedPattern({pattern, setPattern} : ConfirmSelectedPatternProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cellSize = 10
  const [nameInput, setNameInput] = useState('')

  const trimPattern = (grid: number[][]): number[][] => {

    const isGridEmpty = grid.every((row) => row.every((cell) => cell === 0));
    if (isGridEmpty) {
      return []; // Retourne une grille vide ou un tableau par défaut
    }
    // Trouver les indices des premières et dernières lignes et colonnes contenant un `1`
    let top = 0,
      bottom = grid.length - 1;
    let left = 0,
      right = grid[0].length - 1;

    // Trouver la première ligne avec un `1`
    while (top <= bottom && grid[top].every((cell) => cell === 0)) top++;
    // Trouver la dernière ligne avec un `1`
    while (bottom >= top && grid[bottom].every((cell) => cell === 0)) bottom--;

    // Trouver la première colonne avec un `1`
    while (
      left <= right &&
      grid.every((row) => row[left] === 0)
    )
      left++;
    // Trouver la dernière colonne avec un `1`
    while (
      right >= left &&
      grid.every((row) => row[right] === 0)
    )
      right--;

    // Retourner le sous-tableau découpé
    return grid.slice(top, bottom + 1).map((row) => row.slice(left, right + 1));
  };



const handleSavePattern = () => {
if (pattern && nameInput) {

  const trimmedPattern = trimPattern(pattern);
  let savedPatterns : TPattern[]  = []
  if (LocalStorage.getItem('savedPatterns')) {
    savedPatterns = LocalStorage.getItem('savedPatterns')
  }
  

  LocalStorage.setItem('savedPatterns', [...savedPatterns, {name : nameInput, grid : trimmedPattern}])
  setNameInput('');
  setPattern(null);
}
}


useEffect(() => {

  const canvas = canvasRef.current
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (!pattern) return
  const trimmedPattern = trimPattern(pattern);

    // Si la grille est vide après découpage
    if (trimmedPattern.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return; // Ne rien dessiner
    }
 
  // J'Efface le canvas avant de redessiner
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0 ; i < trimmedPattern.length ; i++ ) {
    for (let j = 0 ; j < trimmedPattern[i].length ; j++) {
      const x = j * cellSize 
      const y = i * cellSize

      ctx.fillStyle = trimmedPattern[i][j] === 1 ? "white" : "black"
      ctx.fillRect (x, y, cellSize, cellSize)
      ctx.strokeStyle = 'rgb(61,61,61)'
      ctx.strokeRect(x, y , cellSize, cellSize)
    }
  }
})


  return (
    <>
  { pattern && trimPattern(pattern).length && (<div className='confirm_modal'>
    <p className='confirm_modal_title'> Save this pattern ?</p>

<div>
  <input type="text" className='confirm-modal_input' value={nameInput} onChange={(e) => setNameInput(e.currentTarget.value)} />
</div>
<div className='canvas_container'>
  {pattern && <canvas
    className='canvas'
    ref={canvasRef}
    width={trimPattern(pattern)[0].length * cellSize}
    height={trimPattern(pattern).length * cellSize}
/>}
    
</div>


<div className='confirm_modal-buttons_container'>
<button type="button" className='confirmation_button' onClick={ handleSavePattern}>Save </button>
<button type="button" className='confirmation_button' onClick={()=> setPattern(null)}> Cancel</button>
</div>

  </div>
  )}
  </>
      );
}

export default ConfirmSelectedPattern;