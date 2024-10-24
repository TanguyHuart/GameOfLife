import React, { createContext, useContext, useState } from 'react';

type GridContextProps = {

   grid : number[][]
   setGrid : React.Dispatch<React.SetStateAction<number[][]>>
}


const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  const [grid, setGrid ] = useState<number[][]>([])
  

  return (

    <GridContext.Provider value={{  grid, setGrid  }} >
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