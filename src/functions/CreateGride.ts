 export const createGrid = (rows : number , cols : number) => {
  const initialGrid = [];
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      row.push(0)
      
    }
    initialGrid.push(row);
  }
  return initialGrid;
}

export function clearCanvasGrid(rows: number, cols: number): number[][] {

  
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = new Array(cols).fill(0);
    grid.push(row);
  }
  return grid;
}

export function createCanvasGrid(rows: number, cols: number, fastSavedGrid : number[][] | null): number[][] {

  let grid : number[][] = [];
  if (fastSavedGrid) {
grid = fastSavedGrid
  }

  
  for (let i = 0; i < rows; i++) {
    const row = new Array(cols).fill(0);
    grid.push(row);
  }
  return grid;
}