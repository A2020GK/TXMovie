import toast from "@brenoroosevelt/toast";
import { useState } from "react";
import ProjectState from "./ProjectState";
import Header from "./Header";
import "./css/App.css";
import Objects from "./Objects";
import Scene from "./Scene";
import Character from "./Character";
import { uploadFile } from "./fileUtils";
import CharacterImage from "./CharacterImage";
import {cloneObject} from "./utils";
import Timeline from "./Timeline";

toast.create("Application started",{type:"success",duration:2000,title:"App"});
function App() {
    const [history,setHistory]=useState([new ProjectState]);
    const [currentState,setCurrentState]=useState(history.length-1);

    let project=history[currentState];

    function updateProject(projectClone) {
        const nextHistory=[...history.slice(0,currentState+1),projectClone];
        setHistory(nextHistory);
        setCurrentState(nextHistory.length-1);
    }

    function undo() {
        if(currentState>0) {
            setCurrentState(currentState-1);
            toast.create(`Canceled "${project.lastOperation}"`,{type:"info",title:"Undo",duration:2000});
        } else toast.create(`Cannot undo "${project.lastOperation}", it's first element in the history`,{type:"error",title:"Undo",duration:2000});
    }

    function redo() {
        if(currentState<history.length-1) {
            setCurrentState(currentState+1);
            toast.create(`Repeated "${project.lastOperation}"`,{type:"info",title:"Redo",duration:2000});
        } else toast.create(`There's nothing to repeat`,{type:"error",title:"Redo",duration:2000});
    }

    function uploadNewCharacter() {
        let projectNew=cloneObject(project)

        uploadFile(content=>{
            let character=Character.fromTXCFile(content);
            projectNew.characters.push(character);
            
            projectNew.lastOperation=`Import ${character.name}`;

            updateProject(projectNew);
            toast.create(`Imported ${character.name}`,{type:"success",title:"Character imported",duration:2000});
        }, ".txc");
    }
    function createImage(index) {
        let projectNew=cloneObject(project);
        let image=new CharacterImage(projectNew.characters[index]);
        projectNew.objects.push(image);
        projectNew.lastOperation=`Create image for ${projectNew.characters[index].name}`;
        updateProject(projectNew);
        toast.create(`Created image for ${projectNew.characters[index].name}`,{type:"success",title:"Image created",duration:2000});
    }

    function deleteCharacter(index) {
        let projectNew=cloneObject(project);
        let chr=projectNew.characters[index];
        projectNew.objects=projectNew.objects.filter(obj=>obj.character.id!=chr.id);
        projectNew.characters.splice(index,1);
        projectNew.lastOperation=`Delete ${chr.name}`;
        updateProject(projectNew);
        Character.id--;
        toast.create(`Deleted character ${chr.name}`,{type:"error",title:"Character deleted",duration:2000});
    }

    function deleteImage(index) {
        let projectNew=cloneObject(project);
        let obj=projectNew.objects[index];
        projectNew.objects.splice(index,1);
        projectNew.lastOperation=`Delete image for ${obj.character.name}`;
        updateProject(projectNew);
        toast.create(`Deleted image for ${obj.character.name}`,{type:"error",title:"Image deleted",duration:2000});
    }

    return <>
        <Header
            undo={undo}
            redo={redo}
        />
        <div className="editor">
            <Objects 
                uploadCharacter={uploadNewCharacter}
                createImage={createImage}
                deleteCharacter={deleteCharacter}
                deleteImage={deleteImage}
                characters={project.characters} 
                images={project.objects}
            />
            <div className="workspace">
                <Scene objects={project.objects}/>
                <Timeline/>
            </div>
        </div>
    </>;
}

export default App;