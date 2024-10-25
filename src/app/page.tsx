'use client'

import CanvasGrid from '@/components/CanvasGrid/CanvasGrid';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Grid from '@/components/Grid/Grid';
import Menu from '@/components/Menu/Menu';
import { GridProvider } from '@/context/GridContext';
import { RulesProvider } from '@/context/RulesContext';

// Composant Triangle


function App() {
 
  return (
 <RulesProvider >
  <GridProvider>
    <Menu /> 
    <CanvasGrid />
    </GridProvider>
 </RulesProvider>
  );
}

export default App;
