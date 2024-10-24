import {  useState } from "react";
import './Square.css'
import React from "react";
import { useRulesContext } from "@/context/RulesContext";

type SquareProps = {
  isAlive : boolean,
  onClick : () => void
 
}

function Square({isAlive, onClick} : SquareProps) {


const [isMouseHover, setIsMouseHover] = useState(false)
const {isRunning} = useRulesContext()
const width = 20

  return (
    <svg width={width} height={width}  className="square" onMouseEnter={() => setIsMouseHover(true)} onClick={ onClick}  onMouseLeave={() => {setIsMouseHover(false)}}>
      <rect width={width} height={width} stroke={`${isRunning ? '' : "grey" }`} fill={`${isMouseHover && !isAlive ? 'grey' : ''} ${isAlive ? 'white' : ''}`}  />
    </svg>
  );
}

// Utilisation de React.memo pour éviter les re-rendus inutiles
export default React.memo(Square, (prevProps, nextProps) => {
  // Ne ré-rendre le composant que si isAlive a changé
  return prevProps.isAlive === nextProps.isAlive;
});