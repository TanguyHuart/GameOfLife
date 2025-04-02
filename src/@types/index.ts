export type TPattern = {
  name : string ,
  grid : number[][]
}

export type TColorPicker = {
  id : number
  gridBackgroundColor : string,
  cellColor : string,
  strokeGridColor : string
}

export type TDialog = {
  id : number,
  tutorialSteps : number,
  dialogIndex : number,
  speedText : number,
  dialog : string,
  clickForNext: boolean
}