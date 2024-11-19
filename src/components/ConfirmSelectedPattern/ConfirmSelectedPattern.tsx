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


const handleSavePattern = () => {
if (pattern && nameInput) {

  let savedPatterns : TPattern[]  = []
  if (LocalStorage.getItem('savedPatterns')) {
    savedPatterns = LocalStorage.getItem('savedPatterns')
  }
  

  LocalStorage.setItem('savedPatterns', [...savedPatterns, {name : nameInput, grid : pattern}])
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

  // J'Efface le canvas avant de redessiner
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0 ; i < pattern.length ; i++ ) {
    for (let j = 0 ; j < pattern[i].length ; j++) {
      const x = j * cellSize 
      const y = i * cellSize

      ctx.fillStyle = pattern[i][j] === 1 ? "white" : "black"
      ctx.fillRect (x, y, cellSize, cellSize)
      ctx.strokeStyle = 'rgb(61,61,61)'
      ctx.strokeRect(x, y , cellSize, cellSize)
    }
  }
})


  return (<div className='confirm_modal'>
    <p> Veux-tu sauvegarder cette figure ?</p>

<div>
  <input type="text" value={nameInput} onChange={(e) => setNameInput(e.currentTarget.value)} />
</div>
<div className='canvas_container'>
  {pattern && <canvas
    className='canvas'
    ref={canvasRef}
    width={pattern[0].length * cellSize}
    height={pattern.length * cellSize}
/>}
    
</div>


<div className='confirm_modal-buttons_container'>
<button type="button" className='confirmation_button' onClick={ handleSavePattern}>Save </button>
<button type="button" onClick={()=> setPattern(null)}> Cancel</button>
</div>

  </div>
      );
}

export default ConfirmSelectedPattern;