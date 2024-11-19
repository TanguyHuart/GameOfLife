import { TPattern } from '@/@types';
import React, { createContext, useContext, useState } from 'react';

type GridContextProps = {

   grid : number[][]
   setGrid : React.Dispatch<React.SetStateAction<number[][]>>
   savedGrid : number[][] | null,
   setSavedGrid : React.Dispatch<React.SetStateAction<number[][] | null>>
   offsetX : number;
   setOffsetX : React.Dispatch<React.SetStateAction<number>>
   offsetY : number;
   setOffsetY : React.Dispatch<React.SetStateAction<number>>
   showGrid : boolean,
   setShowGrid : React.Dispatch<React.SetStateAction<boolean>>,
   zoom : number,
   setZoom : React.Dispatch<React.SetStateAction<number>>,
   selectionMode : boolean
   setSelectionMode : React.Dispatch<React.SetStateAction<boolean>>,
   selectedSavePattern : TPattern | null,
   setSelectedSavePattern : React.Dispatch<React.SetStateAction<TPattern | null>>,
}


const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  const [grid, setGrid ] = useState<number[][]>([])
  const [savedGrid , setSavedGrid] = useState<number[][] | null>(null)
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom , setZoom] = useState(1.3);
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedSavePattern, setSelectedSavePattern] = useState<TPattern | null >(null) 
  

  return (

    <GridContext.Provider value={{  grid, setGrid, offsetX, setOffsetX, offsetY, setOffsetY, showGrid, setShowGrid, savedGrid, setSavedGrid, zoom, setZoom, selectionMode, setSelectionMode, selectedSavePattern, setSelectedSavePattern  }} >
      {children}
    </GridContext.Provider>

  )
}

export const useGridContext = () => {

  const context = useContext(GridContext);
  if (!context) {
    throw new Error("erreur lors de l'utilisation du provider")
  }
  return context
}