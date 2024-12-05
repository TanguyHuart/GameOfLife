'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type MusicContextProps = {
musicIsOn : boolean,
setMusicIsOn : React.Dispatch<React.SetStateAction<boolean>>
}

const MusicContext = createContext<MusicContextProps | undefined>(undefined);

export const MusicProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  const [musicIsOn, setMusicIsOn ] = useState(false)
  const musicElementRef = useRef<HTMLMediaElement | null>(null)
  
  useEffect(() => {
    
    if (musicElementRef.current) {
      musicElementRef.current.volume =  0.35
    }
  }, [musicIsOn])

  return (
    <MusicContext.Provider value={{musicIsOn, setMusicIsOn} } >
       { musicIsOn && <audio ref={musicElementRef} autoPlay loop src='/music/glowtopia-backgroundsound.mp3'/>}
      {children}
    </MusicContext.Provider>
  )
}

export const useMusicContext = () => {

  const context = useContext(MusicContext);
  if (!context) {
    console.error("MusicContext must be used within a MusicProvider");
    return { musicIsOn: false, setMusicIsOn: () => {} }; // Fallback sécurisé
  }
  return context
}