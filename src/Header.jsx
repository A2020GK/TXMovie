import "./css/Header.css";
import Dropdown from "./Dropdown";

function Header({undo,redo}) {
    return <>
        <div className="header">
            <Dropdown title="File">
                <a href="#">Open</a>
            </Dropdown>
            <Dropdown title="Edit">
                <a href="#" onClick={undo}>Undo</a>
                <a href="#" onClick={redo}>Redo</a>
            </Dropdown>
            <Dropdown title="Video">
                <a href="#">Frames</a>
            </Dropdown>
            <span>
                <span className="box">TXMovie</span>
            </span>
        </div>
    </>
}
export default Header