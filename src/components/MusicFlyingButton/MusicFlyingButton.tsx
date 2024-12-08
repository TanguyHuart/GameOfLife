import "./MusicFlyingButton.css"

import { useMusicContext } from "@/context/MusicContext";
import Image from "next/image";
import { useState } from "react";

function MusicFlyingButton() {


const {musicIsOn, setMusicIsOn} = useMusicContext()
const [isFullScreen, setIsFullScreen] = useState(true)

const enterFullScreen = () => {
  const element = document.documentElement; // Cible l'élément <html>

  if (element.requestFullscreen) {
    setIsFullScreen(true)
    element.requestFullscreen();
  } else {
    console.error("Fullscreen API is not supported by this browser.");
  }
};

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    setIsFullScreen(false)

};
}


const handleClickFullScreenButton = () => {
if (isFullScreen) {
exitFullScreen()
}
else {
enterFullScreen()
}
} 

  return (
    <div className='musicFlyingButton'>
    <button className='onOffMusicButton' type="button" onClick={() => setMusicIsOn(!musicIsOn)}>
       { musicIsOn ? 
       <Image className='onOffMusicImage' width= {30} height={30} src={'/icons/musiqueon.png'} alt='musicOnIcon' /> : <Image className='onOffMusicImage' src={'/icons/musiqueoff.png'} width={30} height={30} alt='musicOffIcon' />}
    </button> 
    
      <button onClick={handleClickFullScreenButton} className='fullScreenButton'>
        <Image src={'/icons/fullscreen.png'} className='socialsIcons' alt='fullscreen icon' width={30} height={30} />
      </button>
    
  </div>
  );
}

export default MusicFlyingButton;