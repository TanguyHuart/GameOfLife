import Link from "next/link";
import './MainMenu.css';
import GameTitle from "../GameTitle/GameTitle";

function MainMenu() {
  return (
    <div className="main-menu">
       <GameTitle />
        <div className="menu-button-container">
          <button className="menu-button" type="button">Tutoriel <br /> (in progress) </button>
        </div>
      
        <Link className="menu-button-container" href={'/sandbox'}>
          <button className="menu-button" type="button">SandBox</button>
        </Link>
    
    </div>
  );
}

export default MainMenu;