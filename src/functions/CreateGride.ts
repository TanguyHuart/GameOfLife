 const createGrid = (rows : number , cols : number) => {
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

export default createGrid