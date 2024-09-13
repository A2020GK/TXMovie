import "./css/Dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

function Dropdown({ title, children }) {

    return <>
        <div className="dropdown">
            <div className="dropdown-toggle box"><FontAwesomeIcon icon={faCaretRight} /> {title}</div>
            <div className="dropdown-content">
                {children}
            </div>
        </div>
    </>;
}
export default Dropdown;