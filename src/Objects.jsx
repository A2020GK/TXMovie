import Dropdown from "./Dropdown";
import "./css/Objects.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

function Objects({ uploadCharacter, createImage, deleteCharacter, deleteImage, characters, images }) {

    let chrs = [];
    characters.forEach((chr, i) => chrs.push(<li key={i}><Dropdown title={chr.name}>
        <a href="#" onClick={() => createImage(i)}>Create image</a>
        <a href="#" onClick={() => deleteCharacter(i)}>Delete</a>
    </Dropdown></li>));

    let imgs = [];
    images.forEach((img, i) => imgs.push(<li key={i}><Dropdown title={`${img.character.name}:${i}`}>
        <a href="#">Select</a>
        <a href="#" onClick={() => deleteImage(i)}>Delete</a>
    </Dropdown></li>))

    return <>
        <div className="sidebar">
            <h2>Objects</h2>
            <div className="object-group">
                <h3>Static Characters</h3>
                <button onClick={uploadCharacter}><FontAwesomeIcon icon={faFileArrowUp} /> Upload new</button>
                <ul>{chrs}</ul>
            </div>
            <div className="object-group">
                <h3>Images</h3>
                {imgs.length > 0 ? (<ul>{imgs}</ul>) : <p>-- Nothing here --</p>}
            </div>
        </div>
    </>;
}
export default Objects;