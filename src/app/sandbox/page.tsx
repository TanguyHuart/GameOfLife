'use client'

import CanvasGrid from "@/components/CanvasGrid/CanvasGrid";
import InformationModale from "@/components/InformationModale/InformationModale";
import Menu from "@/components/Menu/Menu";
import MusicFlyingButton from "@/components/MusicFlyingButton/MusicFlyingButton";
import SocketConnexion from "@/components/SocketConnexion/SocketConnexion";
import { GridProvider } from "@/context/GridContext";
import { RulesProvider } from "@/context/RulesContext";
import { SocketProvider } from "@/context/SocketContext";




function SandBoxPage() {


  return (
    <SocketProvider>
      <RulesProvider>
        <GridProvider>
          <SocketConnexion />
          <Menu /> 
          <CanvasGrid />
          <MusicFlyingButton />
          <InformationModale />
        </GridProvider>
      </RulesProvider>
    </SocketProvider>
  );
}

export default SandBoxPage;