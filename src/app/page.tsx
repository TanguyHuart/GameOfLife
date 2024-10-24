'use client'

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
    <Grid />
    </GridProvider>
 </RulesProvider>
  );
}

export default App;
