'use client'

import MainMenu from '@/components/MainMenu/MainMenu';
import './page.css'
import {  useMusicContext } from '@/context/MusicContext';
import MusicAutorisationModale from '@/components/MusicAutorisationModale/MusicAutorisationModale';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function App() {

  const [isReady, setIsReady] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true)
  const {musicIsOn , setMusicIsOn} = useMusicContext()

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
  
    <div className='home-page'>
    
     { !isReady ? 
     <MusicAutorisationModale setIsReady={setIsReady} />
     : <div className='opacityEntrance'>
    
        <MainMenu />
        
      </div>}
      <div className='footer'>
      <div className='socials_container'>
       <Link target='_blank' href={'https://github.com/TanguyHuart'}> 
        <Image alt='github logo' src={'/icons/github-logo.png'} className='socialsIcons' width={50} height={50} />
       </Link>
       <Link target='_blank' href={'https://www.linkedin.com/in/tanguy-huart-409931289'}> 
        <Image alt='linkedin logo' src={'/icons/linkedin.png'} className='socialsIcons' width={50} height={50} />
       </Link>
       <Link target='_blank' href={'https://ystwebdev.vercel.app/'}> 
        <Image alt='yst logo' src={'/icons/logo 64px.png'} className='socialsIconsYsT' width={50} height={50} />
       </Link>
      </div>
      <div className='musicButtonContainer'>
          <button className='onOffMusicButton' type="button" onClick={() => setMusicIsOn(!musicIsOn)}>
             { musicIsOn ? 
             <Image className='onOffMusicImage' width= {50} height={50} src={'/icons/musiqueoff.png'} alt='musicOffIcon' /> : <Image className='onOffMusicImage' src={'/icons/musiqueon.png'} width={50} height={50} alt='musicOnIcon' />}
          </button> 
          
            <button onClick={handleClickFullScreenButton} className='fullScreenButton'>
              <Image src={'/icons/fullscreen.png'} className='socialsIcons' alt='fullscreen icon' width={50} height={50} />
            </button>
          
        </div>
      </div>
    </div>
  );
}

export default App;
