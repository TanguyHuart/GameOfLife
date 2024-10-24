
import React, { createContext, useContext, useState } from 'react';

type RulesContextProps = {

  lifeIsCreatedWith : number,
  setLifeIsCreatedWith : React.Dispatch<React.SetStateAction<number>>,
  lifeIsKeptWithMin : number,
  setLifeIsKeptWithMin : React.Dispatch<React.SetStateAction<number>>,
  lifeIsKeptWithMax : number,
  setLifeIsKeptWithMax : React.Dispatch<React.SetStateAction<number>>,
  interval : number,
   setInterval :  React.Dispatch<React.SetStateAction<number>>,
   isRunning : boolean,
   setIsRunning : React.Dispatch<React.SetStateAction<boolean>>
   grid : number[][]
   setGrid : React.Dispatch<React.SetStateAction<number[][]>>
}


const RulesContext = createContext<RulesContextProps | undefined>(undefined);

export const RulesProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  const [lifeIsCreatedWith, setLifeIsCreatedWith]  = useState(3)
  const [lifeIsKeptWithMin, setLifeIsKeptWithMin] = useState(2)
  const [lifeIsKeptWithMax, setLifeIsKeptWithMax] = useState(3) 
  const [interval, setInterval] = useState(500) 
  const [isRunning, setIsRunning] = useState(false)
  const [grid, setGrid ] = useState<number[][]>([])
  

  return (

    <RulesContext.Provider value={{ lifeIsCreatedWith, setLifeIsCreatedWith, lifeIsKeptWithMin, setLifeIsKeptWithMin, lifeIsKeptWithMax, setLifeIsKeptWithMax, interval, setInterval, isRunning, setIsRunning, grid, setGrid  }} >
      {children}
    </RulesContext.Provider>

  )
}

export const useRulesContext = () => {

  const context = useContext(RulesContext);
  if (!context) {
    throw new Error("erreur lors de l'utilisation du provider")
  }
  return context
}