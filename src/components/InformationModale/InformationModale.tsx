import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";
import "./InformationModale.css"

function InformationModale() {

  const {informationPopUp, setInformationPopUp} = useSocketContext() 

  useEffect(() => {
    if (informationPopUp) {
    const timeInfo = setTimeout(() => setInformationPopUp(null) , 4000)

    return () => clearTimeout(timeInfo)
  } },[informationPopUp, setInformationPopUp])

  return (
  <>
    {informationPopUp && 
      <div className="information-popup">
        <p className="information-popup_text">{informationPopUp}</p>
      </div>}
  </>
  );
}

export default InformationModale;