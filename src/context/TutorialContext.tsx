import { createContext, useContext, useState } from "react";

type TutorialContextProps = {
tutorialSteps : number,
setTutorialSteps : React.Dispatch<React.SetStateAction<number>>,
dialogsIndex : number,
setDialogsIndex : React.Dispatch<React.SetStateAction<number>>
allowDraging : boolean, 
setAllowDraging : React.Dispatch<React.SetStateAction<boolean>> ,
allowSelection: boolean , 
setAllowSelection : React.Dispatch<React.SetStateAction<boolean>> ,
isInteractive : boolean, 
isWriting : boolean ,
setIsWriting : React.Dispatch<React.SetStateAction<boolean>>
setIsInteractive: React.Dispatch<React.SetStateAction<boolean>>,
trackEvent: (eventType: string, data?: any) => void;

}

const TutorialContext = createContext<TutorialContextProps | undefined>(undefined);

export const TutorialProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {


const [tutorialSteps, setTutorialSteps] = useState<number>(1);
const [dialogsIndex,  setDialogsIndex] = useState<number>(0);
const [allowDraging, setAllowDraging] = useState<boolean>(true);
const [allowSelection, setAllowSelection] = useState<boolean> (false);
const [isInteractive, setIsInteractive] = useState<boolean>(false)
const [isWriting, setIsWriting] = useState<boolean>(true);
const [movedDistance, setMovedDistance] = useState(0);
const trackEvent = (eventType: string, data?: any) => {
  switch (eventType) {
    case "GRID_MOVED":
      if(tutorialSteps === 1 && dialogsIndex === 4) {
        setMovedDistance((prev) => {
            const newDistance = prev + Math.abs(data.deltaX);
            if (newDistance >= 200) {
              setDialogsIndex((prevIndex) => prevIndex + 1); // Passer à l'étape suivante
              return 0; // Réinitialiser la distance
            }
            return newDistance;
          });
      }
      break;
  
    default:
      break;
  }
};

  return (

    <TutorialContext.Provider value={{tutorialSteps, setTutorialSteps,dialogsIndex, setDialogsIndex, allowDraging, setAllowDraging, allowSelection,setAllowSelection,isInteractive, setIsInteractive, isWriting, setIsWriting, trackEvent}} >
      {children}
    </TutorialContext.Provider>

  )
}

export const useTutorialContext = () => {

  const context = useContext(TutorialContext);
  if (!context) {
    return {
      tutorialSteps: 0,
      setTutorialSteps: () => {},
      dialogsIndex: 0,
      setDialogsIndex: ()=> {},
      allowDraging: true,
      setAllowDraging: () => {},
      allowSelection: true,
      setAllowSelection: () => {},
      isInteractive: true,
      setIsInteractive: () => {},
      trackEvent: () => {}
    };
  }
  return context
}