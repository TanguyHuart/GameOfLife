

import React, { createContext, useContext, useState } from 'react';

type SocketContextProps = {

isConnected : boolean,
setIsConnected : React.Dispatch<React.SetStateAction<boolean>>
transport : string,
 setTransport : React.Dispatch<React.SetStateAction<string>>
shareGrid : number[][],
setShareGrid : React.Dispatch<React.SetStateAction<number[][]>>,
roomName : string | undefined,
setRoomName : React.Dispatch<React.SetStateAction<string | undefined >>,
informationPopUp : string | null,
setInformationPopUp : React.Dispatch<React.SetStateAction<string | null >>
}




const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {


  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [shareGrid, setShareGrid] = useState<number[][]>([]);
  const [roomName, setRoomName] = useState<string | undefined>();
  const [informationPopUp, setInformationPopUp] = useState<string|null>(null);
  

  return (

    <SocketContext.Provider value={{shareGrid, setShareGrid, isConnected, setIsConnected, transport, setTransport, roomName, setRoomName, informationPopUp, setInformationPopUp}} >
      {children}
    </SocketContext.Provider>

  )
}

export const useSocketContext = () => {

  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("erreur lors de l'utilisation du provider")
  }
  return context
}