
import { useEffect, useState } from 'react';
import './DialogBox.css';
import { TDialog } from '@/@types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { useTutorialContext } from '@/context/TutorialContext';
import dialogs from "@/data/dialogs/tutorial/dialogs.json";

type DialogBoxProps = {

}

function DialogBox( {} : DialogBoxProps) {

  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(TextPlugin);
  const {tutorialSteps, setTutorialSteps, dialogsIndex, setDialogsIndex} = useTutorialContext()
  const [isWriting, setIsWriting] = useState<boolean>(true);

  const [stepDialogs, setStepsDialogs] = useState<TDialog[]>([])

  const [currentDialog, setCurrentDialog] = useState<TDialog | null>();
  const [dialogText, setDialogText] = useState<string>('');


useEffect(() => {
  setStepsDialogs(dialogs.filter((dialog) => dialog.tutorialSteps === tutorialSteps))
},[tutorialSteps])


  useEffect(() => {
    setCurrentDialog(stepDialogs[dialogsIndex])
  },[stepDialogs])

  useEffect(() => {
    if (dialogsIndex < stepDialogs.length) {
      setCurrentDialog(stepDialogs[dialogsIndex]);     
    }
    else {
     setTutorialSteps(tutorialSteps + 1)
      return
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dialogsIndex, setDialogsIndex, setTutorialSteps,] )


useGSAP(()=> {
  if (currentDialog) {
    if (isWriting) {
      gsap.to('.tutorial_page__dialog', {
        duration: currentDialog.speedText,
        text: currentDialog.dialog,
        ease: 'none',
        onComplete: () => {
          setIsWriting(false);
        }
      });
    } else {
      gsap.to('.tutorial_page__dialog', {
        duration: 0.5,
        text: currentDialog.dialog,
        ease: 'none',
      });
    }
  }
},[currentDialog])

const handleClick = () => {
  if (isWriting) return;
  if (!currentDialog?.clickForNext) return;
  setDialogText('');
  setIsWriting(true);
  setCurrentDialog(null);
  setDialogsIndex(dialogsIndex +1);
}


  return (
    <div onClick={handleClick} className="tutorial_page__dialogs_box">
       { currentDialog && <p className="tutorial_page__dialog" >{dialogText}</p>}
        {!isWriting && (
          <div  className="tutorial_page__dialogs_box__nextbutton">&gt;&gt;</div>
        )}
      </div>

  );
}

export default DialogBox;

