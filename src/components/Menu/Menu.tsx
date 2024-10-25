/* eslint-disable react/no-unescaped-entities */
import { useRulesContext } from '@/context/RulesContext';
import './Menu.css'
import {createCanvasGrid} from '@/functions/CreateGride';
import { useGridContext } from '@/context/GridContext';


function Menu() {

const {
  lifeIsCreatedWith,
  setLifeIsCreatedWith,
  lifeIsKeptWithMin,
  setLifeIsKeptWithMin,
  lifeIsKeptWithMax,
  setLifeIsKeptWithMax,
  interval,
  setInterval,
  isRunning,
  setIsRunning
  
} = useRulesContext()

const {setGrid , setOffsetX, setOffsetY, showGrid, setShowGrid} = useGridContext()


const rows = 200
const cols = 200

  return (
    <nav className='menu'>
      <div>
        <h1 className='menu_title'>GAME OF LIFE</h1>
      </div>
      <div className='menu_board'>
      <div className='menu_options'>
        <div className='options_items'>
          <label htmlFor="lifeIsCreateWith">Nombre de cellules vivantes adjacentes nécéssaires pour faire apparaitre une cellule vivante</label>
          <input className='items_input' type="number" placeholder='3' id="lifeIsCreateWith" value={lifeIsCreatedWith} onChange={(event) => setLifeIsCreatedWith(parseInt(event.target.value))} />
        </div>
        <div className='options_items'>
          <label htmlFor="lifeIsKeptWithMin">Nombre de cellules vivantes adjacentes minimum nécéssaires pour qu'une cellule reste vivante</label>
          <input className='items_input' type="number" placeholder='2' id="lifeIsKeptWithMin" value={lifeIsKeptWithMin} onChange={(event) => setLifeIsKeptWithMin(parseInt(event.target.value))} />
        </div>
        <div className='options_items'>
          <label htmlFor="lifeIsKeptWithMax">Nombre de cellules vivantes adjacentes maximum nécéssaires pour qu'une cellule reste vivante</label>
          <input className='items_input' type="number" placeholder='3' id="lifeIsKeptWithMax" value={lifeIsKeptWithMax} onChange={(event) => setLifeIsKeptWithMax(parseInt(event.target.value))} />
        </div>
        <div className='options_items'>
          <label htmlFor="interval">Intervalle entre chaque génération en ms</label>
          <input className='items_slider' type="range" min={0} max={1000} placeholder='1000' id="interval" value={interval} onChange={(event) => setInterval(parseInt(event.target.value))} />
        </div>
      </div>
      <div>
        <button type='button' onClick={() => setShowGrid(!showGrid)}>
          {!showGrid && "Show grid"}
          {showGrid && "Hide grid"}
        </button>
      </div>

      <div className='board_buttons'>
        <button type='button' className='run_button' onClick={() => setIsRunning(!isRunning)}>
          {isRunning && "STOP"}
          {!isRunning && "RUN"}
        </button>
        <button type="button" className='reset_button' onClick={()=> {
          setOffsetX(0);
          setOffsetY(0);
          setGrid(createCanvasGrid(rows, cols)); 
          setIsRunning(false)
          }}>
          RESET
        </button>
      </div>
      </div>
    </nav>
  );
}

export default Menu;