import { useMusicContext } from "@/context/MusicContext";
import './MusicAutorisationModale.css'

type MusicAutorisationModaleProps = {
  setIsReady : React.Dispatch<React.SetStateAction<boolean>>
}


function MusicAutorisationModale({setIsReady} : MusicAutorisationModaleProps) {



  const { setMusicIsOn } = useMusicContext();

  const handleStartGame = () => {
    setIsReady(true);
    setMusicIsOn(true); // Active la musique dès le début
    enterFullScreen()
  };

  const enterFullScreen = () => {
    const element = document.documentElement; // Cible l'élément <html>
  
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else {
      console.error("Fullscreen API is not supported by this browser.");
    }
  };

  return (
    <>
      <div className="splash-screen">
      
        <p className="splash-screen__info">
        For an immersive experience, the game starts with background music that plays automatically and fullscreen display. If you prefer to play without sound or recover your favorite browser, no worries! You can disable theses features anytime using the associated buttons. 
        
        <br /> Have fun exploring and enjoy the game! 
        </p>
      
        <button className="splash-screen__button" onClick={handleStartGame}>Begin</button>
      </div>
   
  </>
  );
}

export default MusicAutorisationModale;