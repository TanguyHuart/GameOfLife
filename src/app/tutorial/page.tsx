"use client";

import { useState } from "react";
import "./page.css";

import Image from "next/image";
import DialogBox from "@/components/DialogBox/DialogBox";
import CanvasGrid from "@/components/CanvasGrid/CanvasGrid";
import { RulesProvider } from "@/context/RulesContext";
import { GridProvider } from "@/context/GridContext";
import MusicFlyingButton from "@/components/MusicFlyingButton/MusicFlyingButton";
import { TutorialProvider } from "@/context/TutorialContext";

function TutorialPage() {


  



  return (
    <div className="tutorial_page">
      <TutorialProvider> 
        <RulesProvider>
        <GridProvider> 
          <CanvasGrid  mode="tutorial" />
          <MusicFlyingButton />
          <DialogBox />  
        </GridProvider>
      </RulesProvider>
      </TutorialProvider>

      {/* <div className="tutorial_page__pixel">
        <Image
          src="/images/pix/glowtopia_logo.png"
          alt="Glowtopia Logo"
          width={100}
          height={100}
        />
      </div> */}
    
    </div>
      
  );
}
export default TutorialPage;
