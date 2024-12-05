const areGridsEqual = (grid1 : number[][], grid2 : number[][]) => {
  if (grid1.length !== grid2.length) return false;

  for (let i = 0; i < grid1.length; i++) {
    if (grid1[i].length !== grid2[i].length) return false;

    for (let j = 0; j < grid1[i].length; j++) {
      if (grid1[i][j] !== grid2[i][j]) {
        return false;
      }
    }
  }
  return true;
};

export default areGridsEqual