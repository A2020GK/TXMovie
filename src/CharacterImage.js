import Character from "./Character";

// 640x480px

class CharacterImage {
    constructor(character) {
        this.character=character;
        this.x=640/2;
        this.y=480/2;

        this.width=this.character.width;
        this.height=this.character.height;

        this.preRender();
        this.image=null;
    }

    preRender() {
        let objects=this.character.objects;
        console.log(objects);

        let canvas=document.createElement("canvas");
        this.image=canvas;
        canvas.width=this.width;
        canvas.height=this.height;

        let ctx=canvas.getContext("2d");

        function txcRender(ctx,objects) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            objects.forEach(element => element.render(ctx));
        }
        txcRender(ctx, objects);

        // DEBUG: Display basepoint
        // ctx.fillStyle="red";
        // ctx.fillRect(this.character.basepoint.x-2,this.character.basepoint.y-2,4,4);
    }
    render(ctx,bx,by) {
        if(this.image==null) this.preRender();
        ctx.drawImage(this.image,bx+this.x-this.character.basepoint.x,by+this.y-this.character.basepoint.y);
    }
}
export default CharacterImage;