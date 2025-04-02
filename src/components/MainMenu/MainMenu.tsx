import Link from "next/link";
import './MainMenu.css';
import GameTitle from "../GameTitle/GameTitle";

function MainMenu() {
  return (
    <div className="main-menu">
       <GameTitle />
        <Link href={'/tutorial'} className="menu-button-container">
          <button className="menu-button" type="button">Tutoriel <br /> (in progress) </button>
        </Link>
      
        <Link className="menu-button-container" href={'/sandbox'}>
          <button className="menu-button" type="button">SandBox</button>
        </Link>
    
    </div>
  );
}

export default MainMenu;