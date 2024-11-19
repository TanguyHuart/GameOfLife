'use client'

/* eslint-disable react/no-unescaped-entities */
import { useRulesContext } from '@/context/RulesContext';
import './Menu.css'
import {clearCanvasGrid, createCanvasGrid} from '@/functions/CreateGride';
import { useGridContext } from '@/context/GridContext';
import { useState } from 'react';
import { LocalStorage } from '@/utils/LocalStorage';
import SavedPatternItem from '../SavedPatternItem/SavedPatternItem';


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

const {grid, setGrid , setOffsetX, setOffsetY, showGrid, setShowGrid, savedGrid, setSavedGrid, zoom, setZoom,selectionMode, setSelectionMode} = useGridContext()
const [menuisOpen, setMenuIsOpen] =useState(false)

const rows = 200
const cols = 200


const handleClickRun = async () => {
  if (!isRunning) {    
    setSavedGrid(grid) 
  }
  setIsRunning(!isRunning)
}

  return (
<>
  <div className={`menu_container ${menuisOpen ? '' : 'hidden'}`}>    
  <nav className='menu'>
  <h1 className='menu_title'>GAME OF LIFE</h1>
      <div className='menu_board'>
      <div className='board_buttons'>
        <button type='button' className='run_button' onClick={ handleClickRun}>
          {isRunning && "STOP"}
          {!isRunning && "RUN"}
        </button>
        <button type="button" className='reset_button' onClick={()=> {
          setOffsetX(0);
          setOffsetY(0);
          setGrid(createCanvasGrid(rows, cols,savedGrid )); 
          setIsRunning(false)
          }}>
          RESET
        </button>
        <button type='button' className='clear_button' onClick={() => {
          setOffsetX(0)
          setOffsetY(0);
          setGrid(clearCanvasGrid(rows, cols))
        }}>
          CLEAR
        </button>
      </div>
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
          <input className='items_slider' type="range" min={0.0001} max={1000} placeholder='1000' id="interval" value={interval} onChange={(event) => setInterval(parseInt(event.target.value))} />
        </div>
      </div>
      <div>
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
        <p className='menu_section_title'>Models saved</p>
        
        <div className='menu_section_models_list'>
          {LocalStorage.getItem('savedPatterns') && LocalStorage.getItem('savedPatterns').map((pattern : {name : string , grid : number[][]}, index : number) => (
            <SavedPatternItem key={index} savedPattern={pattern}/>
          ))}
    
    </div>
      </div>
    </nav>

    <div className='menu_mobile_buttons'>
      <div>
        <button className='mobile_menu_button' type="button" onClick={()=> setMenuIsOpen(!menuisOpen)}>Menu</button>
      </div>
      <div>
        <button className='mobile_run_button' onClick={() => handleClickRun()} type="button">
          {isRunning && "Stop"}
          {!isRunning && "Run"}
        </button>
      </div>
      <div>
        <button className='mobile_reset_button' onClick={() => {
          setOffsetX(0);
          setOffsetY(0);
          setGrid(createCanvasGrid(rows, cols, savedGrid)); 
          setIsRunning(false)
          }} type="button">Reset
        </button>
      </div>
    </div>
  </div>
<div className="zoom_input_container">
  <label htmlFor="zoom_input">Zoom</label>
    <div className="zoom_input">
      <div className="zoom_input_symbol">
        <p>-</p>
        <p>+</p>
      </div>
      <input id="zoom_input" className="zoom_input" type="range" min={0.9} max={1.3} step="any" placeholder="1.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}/>
    </div>
</div>
</>
  );
}

export default Menu;