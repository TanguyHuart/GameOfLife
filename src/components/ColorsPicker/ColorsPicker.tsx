import { useEffect, useState } from "react"
import "./ColorsPicker.css"
import { useGridContext } from "@/context/GridContext"

type ColorsPickerProps = {
  colorsPicker : {
  id : number,
  gridBackgroundColor : string, 
  cellColor : string,
  strokeGridColor : string
 }
 setCellColor : React.Dispatch<React.SetStateAction<string>>
 setStrokeGridColor : React.Dispatch<React.SetStateAction<string>>
setGridBackgroundColor : React.Dispatch<React.SetStateAction<string>>
}


function ColorsPicker({colorsPicker, setCellColor, setGridBackgroundColor, setStrokeGridColor} : ColorsPickerProps) {

  const [colorsAreSelected, setColorsAreSelected] = useState(false)
const {selectedColors, setSelectedColors} = useGridContext()

  const handleClickColors = () => {
    setSelectedColors(colorsPicker.id);
    setGridBackgroundColor(colorsPicker.gridBackgroundColor); 
    setCellColor(colorsPicker.cellColor);
    setStrokeGridColor(colorsPicker.strokeGridColor)
  }

  useEffect(() => {    
    if (selectedColors == colorsPicker.id) {
      setColorsAreSelected(true)
    } 
    else {
      setColorsAreSelected(false)
    }
  }, [selectedColors, colorsPicker])


  return (
    <div key={colorsPicker.id} className={`colors_theme ${colorsAreSelected ? 'colorsAreSelected' : ''} `} onClick={handleClickColors}>
            <div className={`colors_items ${colorsAreSelected ? 'colorsAreSelected' : ''} `} style={{backgroundColor : colorsPicker.gridBackgroundColor}}></div>
            <div className={`colors_items ${colorsAreSelected ? 'colorsAreSelected' : ''} `} style={{backgroundColor : colorsPicker.cellColor}}></div>
            <div className={`colors_items ${colorsAreSelected ? 'colorsAreSelected' : ''} `} style={{backgroundColor : colorsPicker.strokeGridColor}}></div>
          </div>
  );
}

export default ColorsPicker;