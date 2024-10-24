import React, { createContext, useContext, useState } from 'react';

type GridContextProps = {

   grid : number[][]
   setGrid : React.Dispatch<React.SetStateAction<number[][]>>
   offsetX : number;
   setOffsetX : React.Dispatch<React.SetStateAction<number>>
   offsetY : number;
   setOffsetY : React.Dispatch<React.SetStateAction<number>>
}


const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  const [grid, setGrid ] = useState<number[][]>([])
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  

  return (

    <GridContext.Provider value={{  grid, setGrid, offsetX, setOffsetX, offsetY, setOffsetY  }} >
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