/* eslint-disable react-hooks/exhaustive-deps */
import { useGridContext } from "@/context/GridContext";
import { useRulesContext } from "@/context/RulesContext";
import { useSocketContext } from "@/context/SocketContext";
import areGridsEqual from "@/functions/AreGridsEqual";
import { clearCanvasGrid, createCanvasGrid } from "@/functions/CreateGride";
import { socket } from "@/socket";


import { useEffect } from "react";


function SocketConnexion() {

  const { setIsConnected,  setTransport, setRoomName, roomName, setInformationPopUp } = useSocketContext();
  const  {grid,  setGrid, setOffsetX, setOffsetY} = useGridContext();
  const {setIsRunning, setInterval} = useRulesContext()
  const rows = 200;
  const cols = 200;




  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.on("room-name", (currentRoom) => {
        setRoomName(currentRoom); // Définir le nom de la room avec currentRoom
      });
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name); 
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on('responseGrid', (value) => {
      if (!areGridsEqual(grid, value)) {
        setGrid(value)
      }
    })
    socket.on('responseRun', (value) => setIsRunning(value))
    socket.on('responseReset', (value) => {      
        setOffsetX(-50);
        setOffsetY(-50);        
        setGrid(createCanvasGrid(rows, cols, value)); 
        setIsRunning(false)
    })
    socket.on('responseClear', () => {
      setOffsetX(-50)
      setOffsetY(-50);
      setGrid(clearCanvasGrid(rows, cols))
    })
    socket.on('responseInterval', (value) => {
      setInterval(value)
    })

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off('room-name');
      socket.off('responseGrid');
      socket.off('responseRun');
      socket.off('responseReset');
      socket.off('responseClear');
      socket.off('responseInterval');
    };
  }, []);


    useEffect(() => {
      socket.emit('join-room', roomName )
      socket.on("room-joined", (roomId) => {
        setInformationPopUp("Socket Connexion succed")
        if (roomId === roomName && socket.id === roomName) {
          
          // Si ce client est l'hôte, émettez la grille
          socket.emit('grid', grid);
        }
        
      });
      socket.on('request-grid', ({targetSocketId}) => {
        console.log(`Demande de grille reçue pour le client ${targetSocketId}`);
        setInformationPopUp("Socket Connexion succed")
        socket.emit('provide-grid', { targetSocketId, grid });
      });
      socket.on("error-joining-room", (message) => {

        setInformationPopUp("Socket Connexion failed")
        console.error(message)})
        return () => {
          socket.off('room-joined')
          socket.off('error-joining-room')
          socket.off('request-grid')

        }
    }, [roomName]);






return (<></>)
}

export default SocketConnexion;