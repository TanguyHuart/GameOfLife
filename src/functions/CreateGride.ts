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

export function createCanvasGrid(rows: number, cols: number): number[][] {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = new Array(cols).fill(0);
    grid.push(row);
  }
  return grid;
}