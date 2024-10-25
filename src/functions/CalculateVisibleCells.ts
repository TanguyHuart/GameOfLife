const calculateVisibleCells = (cavasRef :React.RefObject<HTMLCanvasElement> , offsetX : number, offsetY : number, cellSize : number, grid : number[][]) => {
  const canvas = cavasRef.current;
  if (!canvas) return { startRow: 0, endRow: 0, startCol: 0, endCol: 0 };

  if(grid.length === 0 ) return { startRow: 0, endRow: 0, startCol: 0, endCol: 0 }

  const width = canvas.width;
  const height = canvas.height;

  const startCol = Math.max(0, Math.floor(-offsetX / cellSize));
  const endCol = Math.min(grid[0].length, Math.ceil((width - offsetX) / cellSize));

  const startRow = Math.max(0, Math.floor(-offsetY / cellSize));
  const endRow = Math.min(grid.length, Math.ceil((height - offsetY) / cellSize));

  return { startRow, endRow, startCol, endCol };
};

export default calculateVisibleCells;