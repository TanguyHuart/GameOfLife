const countNeighbors = (grid : number[][] , x : number, y : number,  rows : number, cols : number) =>{

  const direction = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1, -1], [-1, 0], [-1, 1]]

  let aliveNeighbours: number = 0 ;
  
  direction.forEach(([dx, dy]) =>{
    const neighbourX = dx + x ;
    const neighbourY = dy + y;
    if (neighbourX >= 0 && neighbourX < rows && neighbourY >= 0 && neighbourY < cols) {
    aliveNeighbours += grid[neighbourX][neighbourY];}
  })
  return aliveNeighbours
}

export default countNeighbors;