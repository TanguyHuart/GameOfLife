'use client'

/* eslint-disable react/no-unescaped-entities */
import { useRulesContext } from '@/context/RulesContext';
import './Menu.css'
import { useGridContext } from '@/context/GridContext';
import { ChangeEvent, useEffect, useState } from 'react';
import { LocalStorage } from '@/utils/LocalStorage';
import SavedPatternItem from '../SavedPatternItem/SavedPatternItem';
import { TColorPicker, TPattern } from '@/@types';
import ColorArray from '@/data/colors_picker.json'
import { useSocketContext } from '@/context/SocketContext';
import { socket } from '@/socket';
import Image from 'next/image';
import ColorsPicker from '../ColorsPicker/ColorsPicker';
import { clearCanvasGrid, createCanvasGrid } from '@/functions/CreateGride';

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

const { showGrid,grid,savedGrid, setShowGrid, setSavedGrid, zoom, setZoom,selectionMode, setSelectionMode, setCellColor, setGridBackgroundColor, setStrokeGridColor, setOffsetX, setOffsetY, setGrid} = useGridContext()
const { isConnected,  setRoomName } = useSocketContext()
const [menuisOpen, setMenuIsOpen] =useState(false)
const [savedPatterns,  setSavedPatterns] = useState<TPattern[]>([])
const colorArray : TColorPicker[] = ColorArray
const [socketRoomInput , setSocketRoomInput] = useState('')
const [visbleSection , setVisibleSection] = useState('')
const rows = 200;
const cols = 200;


const handleSectionClick = (sectioName : string) => {
 setVisibleSection(sectioName)
}
 

const handleClickRun = async () => {
  if (!isRunning) {        
    setSavedGrid(grid) 
  }
  if (isConnected) {
  socket.emit('runButton', !isRunning)
}
  setIsRunning(!isRunning)
 
}

const handleClickReset = () => {
  if (isConnected) {
  socket.emit('resetButton', savedGrid)
} else {
  setOffsetX(-50);
  setOffsetY(-50);        
  setGrid(createCanvasGrid(rows, cols, savedGrid)); 
  setIsRunning(false)
}
}

const handleClickClear = () => {
  if (isConnected) {
    socket.emit('clearButton')
  }
  else {
    setOffsetX(-50)
    setOffsetY(-50);
    setGrid(clearCanvasGrid(rows, cols))
  }

}

const handleChangeInterval = (event : ChangeEvent<HTMLInputElement> ) => {
  socket.emit('intervalSlider', parseInt(event.target.value))
  setInterval(parseInt(event.target.value))
 
}

useEffect(() => {
  const loadPatterns = () => {
    const patterns = LocalStorage.getItem('savedPatterns') || [];
    setSavedPatterns(patterns);
  };

  // Charger les données initiales
  loadPatterns();

  // Écouter les changements du LocalStorage
  window.addEventListener('storageChange', loadPatterns);

  return () => {
    window.removeEventListener('storageChange', loadPatterns);
  };
}, []);

const handleButton = () => {
  setRoomName(socketRoomInput)
  }
  
  return (
<>
  <div className={`menu_container ${menuisOpen ? '' : 'hidden'}`}>    
    <nav className='menu'>
      <h1 className='menu_title'>GLOWTOPIA</h1>
      <div className='menu_section'>
        <div className='board_buttons'>
          <button type='button' className='run_button' onClick={ handleClickRun}>
            {isRunning && "Stop"}
            {!isRunning && "Run"}
          </button>
          <button type="button" className='reset_button' onClick={handleClickReset}>
            Reset
          </button>
          <button type='button' className='clear_button' onClick={handleClickClear}>
            Clear
          </button>
        </div>
          <div className='zoom_input_container'>
            <label className='options_labels' htmlFor="interval">Speed</label>
            <div className="zoom_input">
              <div className="zoom_input_symbol">
                <p>-</p>
                <p>+</p>
              </div>
            <input className='items_slider' type="range" min={0.0001} max={500} placeholder='500' id="interval" value={interval} onChange={handleChangeInterval} />
            </div>
          </div>
          <div className="zoom_input_container">
            <label className='options_labels' htmlFor="zoom_input">Zoom</label>
            <div className="zoom_input">
              <div className="zoom_input_symbol">
                <p>-</p>
                <p>+</p>
              </div>
              <input id="zoom_input" className="zoom_input" type="range" min={0.98} max={1.3} step="any" placeholder="1.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}/>
            </div>
          </div>
        <div className='options_items_grid'>
          <Image src={'/icons/grid.png'} alt='grid-icon' width={50} height={50} className='options_icons'/>
          <button type='button' className='hideGrid_button' onClick={() => setShowGrid(!showGrid)}>
            {!showGrid && "Show grid"}
            {showGrid && "Hide grid"}
          </button>
        </div>
        <div>
          <div className='mode_button_container'>
            <button type="button" className={`mode_button ${selectionMode ? '' : 'selected'}`} onClick={() => setSelectionMode(false)}>Mode Draw</button>
            <button type="button" className={`mode_button ${selectionMode ? 'selected' : ''}`} onClick={() => setSelectionMode(true)}>Mode Selection</button>
          </div>
        </div>
      </div>
      <div className='menu_section'>
        <h2 onClick={() => handleSectionClick('models')} className='menu_section_title'>Models saved</h2>
        
        { visbleSection === 'models' && <div className='menu_section_models_list'>
          {savedPatterns && savedPatterns.map((pattern : {name : string , grid : number[][]}, index : number) => (
            <SavedPatternItem key={index} savedPattern={pattern}/>
          ))}
    
        </div>}
      </div>
      <div className='menu_section'>
        <h2 onClick={() => handleSectionClick('rules')} className='menu_section_title'>RULES</h2>
       { visbleSection === 'rules' && ( <>
       <div className='options_items'>
          <label className='options_labels' htmlFor="lifeIsCreateWith">Adjacent alive cells to create cells</label>
          <input className='items_input' type="number" placeholder='3' id="lifeIsCreateWith" value={lifeIsCreatedWith} onChange={(event) => setLifeIsCreatedWith(parseInt(event.target.value))} />
        </div>
        <div className='options_items'>
          <label className='options_labels' htmlFor="lifeIsKeptWithMin">Minimum adjacents cells to stay alive</label>
          <input className='items_input' type="number" placeholder='2' id="lifeIsKeptWithMin" value={lifeIsKeptWithMin} onChange={(event) => setLifeIsKeptWithMin(parseInt(event.target.value))} />
        </div>
        <div className='options_items'>
          <label className='options_labels' htmlFor="lifeIsKeptWithMax">Maximum adjacents cells to stay alive</label>
          <input className='items_input' type="number" placeholder='3' id="lifeIsKeptWithMax" value={lifeIsKeptWithMax} onChange={(event) => setLifeIsKeptWithMax(parseInt(event.target.value))} />
        </div>
        </>)} 
      </div>
    
    
      <div className='menu_section'>
        <h2 onClick={() => handleSectionClick('colors')} className='menu_section_title'>Colors</h2>
        { visbleSection === 'colors' && <div className='menu_section_colors_container'>
         { colorArray.map((colorsPickers) => (
          <ColorsPicker key={colorsPickers.id} setGridBackgroundColor={setGridBackgroundColor} setStrokeGridColor={setStrokeGridColor} setCellColor={setCellColor} colorsPicker={colorsPickers} />
          
          )
          )}
        
        </div>}
      </div>
      <div className='menu_section' style={{zIndex : "50"}}>
        <h2 onClick={() => handleSectionClick('share')} className='menu_section_title'> SHARE </h2>
      {visbleSection === 'share' && (<>
      <p className='options_labels'>Status: <span className={`${isConnected ? "isConnected" :" notConnected"} `}>{ isConnected ? "connected" : "disconnected" }</span></p>
      <p className='options_labels'>My ID : {socket.id}</p>
      <div className='zoom_input_container'>
        <label className='options_labels' htmlFor="socketInput">Friend Room :</label>
      <input id='socketInput' className='socketInputField' type="text" onChange={(e) => setSocketRoomInput(e.currentTarget.value)} value={socketRoomInput} />
      </div>
      <button className='hideGrid_button' onClick={handleButton} type="button">Go to Friend Room</button>
      </>)}
    </div>
    
    </nav>

    <div className='menu_mobile_buttons'>
      <div>
        <button className='mobile_menu_button' type="button" onClick={()=> setMenuIsOpen(!menuisOpen)}>
          <Image src={'/icons/burger_menu.png'} width={50} height={40} alt='icon burger' />
        </button>
      </div>
      <div>
        <button className='mobile_run_button' onClick={() => handleClickRun()} type="button">
          {isRunning && "Stop"}
          {!isRunning && "Run"}
        </button>
      </div>
      <div>
        <button className='mobile_reset_button' onClick={handleClickReset} type="button">Reset
        </button>
      </div>
      <div>
        <button className='mobile_clear_button' onClick={handleClickClear} type="button">Clear
        </button>
      </div>
    </div>
  </div>

</>
  );
}

export default Menu;