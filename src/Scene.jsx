import "./css/Scene.css";
import { useRef, useEffect, useState } from "react";

function Scene({objects}) {
    const sceneRef = useRef(null);
    const canvasRef = useRef(null);

    const [canvas,setCanvas]=useState(null);
    const [ctx,setCtx]=useState(null);

    useEffect(() => {
        if (sceneRef.current && canvasRef.current) {
            const maxHeight = window.innerHeight - 125; // adjust this value to your liking
            canvasRef.current.width = sceneRef.current.offsetWidth;
            canvasRef.current.height = Math.min(sceneRef.current.offsetHeight, maxHeight);
            setCanvas(canvasRef.current);
            setCtx(canvasRef.current.getContext("2d"));
        }
    }, []);

    function sceneRender() {
        let zero={x:canvas.width/2-640/2,y:canvas.height/2-480/2};
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle="white";
        ctx.lineWidth=1;
        ctx.strokeRect(zero.x,zero.y,640,480);
        console.log(objects);
        objects.forEach(o=>{
            o.render(ctx,zero.x,zero.y);
        });
    }

    if(canvas!=null && ctx!=null) {
        sceneRender();
    }

    return (
        <div className="scene" ref={sceneRef}>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default Scene;