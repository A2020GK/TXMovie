import { binaryDecode } from "./binUtils";

let compilerRuntime={
    basepoint:{x:0,y:0}
}

function compile_rel_x(x, longmode = false) {
    let basepoint=compilerRuntime.basepoint;
    if (x > basepoint.x) return `${longmode ? "(long)(" : ""}x + ${compile_rel_num(x - basepoint.x)} * mirrorCof${longmode ? ")" : ""}`;
    else if (x == basepoint.x) return `${longmode ? "(long)" : ""}x`;
    else if (x < basepoint.x) return `${longmode ? "(long)(" : ""}x - ${compile_rel_num(basepoint.x - x)} * mirrorCof${longmode ? ")" : ""}`;
}
function compile_rel_y(y, longmode = false) {
    let basepoint=compilerRuntime.basepoint;
    if (y > basepoint.y) return `${longmode ? "(long)(" : ""}y + ${compile_rel_num(y - basepoint.y)}${longmode ? ")" : ""}`;
    else if (y == basepoint.y) return `${longmode ? "(long)" : ""}y`;
    else if (y < basepoint.y) return `${longmode ? "(long)(" : ""}y - ${compile_rel_num(basepoint.y - y)}${longmode ? ")" : ""}`;
}
function compile_rel_num(number) {
    return `${number} * scale`;
}

class Primitive {
    constructor(color, fill_color, line_width) {
        this.color = color;
        this.fill_color = fill_color;
        this.line_width = Number(line_width);
        this.name = "<unnamed>";
    }
    render(ctx) {
        ctx.lineCap = "round";
        ctx.lineWidth = this.line_width;
        ctx.strokeStyle = `rgb(${this.color.r},${this.color.g},${this.color.b})`;
        ctx.fillStyle = this.fill_color == "transparent" ? "transparent" : `rgb(${this.fill_color.r},${this.fill_color.g},${this.fill_color.b})`;
    }
    compile() {
        let c = `    // ${this.name} (Object <${this.constructor.name}>)\r\n`;
        c += `    txSetColor(RGB(${this.color.r}, ${this.color.g}, ${this.color.b}), ${this.line_width});\r\n`;
        c += `    txSetFillColor(${this.fill_color == "transparent" ? "TX_TRANSPARENT" : `RGB(${this.fill_color.r}, ${this.fill_color.g}, ${this.fill_color.b})`});\r\n`;

        return c;
    }
}

class Line extends Primitive {
    constructor(xb, yb, color, fill_color, line_width) {
        super(color, fill_color, line_width);

        this.xb = xb;
        this.yb = yb;

        this.xe = xb;
        this.yb = yb;
    }
    move(xof, yof) {
        this.xb += xof;
        this.yb += yof;
        this.xe += xof;
        this.ye += yof;
    }
    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.xb, this.yb);
        ctx.lineTo(this.xe, this.ye);
        ctx.stroke();
    }
    compile() {
        let c = super.compile();

        c += `    txLine(`
        c += `${compile_rel_x(this.xb)}, `;
        c += `${compile_rel_y(this.yb)}, `;
        c += `${compile_rel_x(this.xe)}, `
        c += `${compile_rel_y(this.ye)});\r\n`;

        return c;
    }
}

class Rectangle extends Primitive {
    constructor(xb, yb, color, fill_color, line_width) {
        super(color, fill_color, line_width);

        this.xb = xb;
        this.yb = yb;

        this.xe = xb;
        this.yb = yb;
    }
    render(ctx) {
        super.render(ctx);
        ctx.fillRect(this.xb, this.yb, this.xe - this.xb, this.ye - this.yb);
        ctx.strokeRect(this.xb, this.yb, this.xe - this.xb, this.ye - this.yb);
    }
    compile() {
        let c = super.compile();

        c += `    txRectangle(`;
        c += `${compile_rel_x(this.xb)}, `;
        c += `${compile_rel_y(this.yb)}, `;
        c += `${compile_rel_x(this.xe)}, `;
        c += `${compile_rel_y(this.ye)});\r\n`;

        return c;
    }
    move(xof, yof) {
        this.xb += xof;
        this.yb += yof;
        this.xe += xof;
        this.ye += yof;
    }
}

class Circle extends Primitive {
    constructor(x, y, color, fill_color, line_width) {
        super(color, fill_color, line_width);

        this.x = x;
        this.y = y;
        this.radius = 0;
    }
    render(ctx) {
        super.render(ctx);

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    compile() {
        let c = super.compile();
        c += `    txCircle(${compile_rel_x(this.x)}, ${compile_rel_y(this.y)}, ${compile_rel_num(this.radius)});\r\n`;

        return c;
    }
    move(xof, yof) {
        this.x += xof;
        this.y += yof;
    }
}

class Ellipse extends Primitive {
    constructor(xb, yb, color, fill_color, line_width) {
        super(color, fill_color, line_width);

        this.xb = xb;
        this.yb = yb;

        this.xe = xb;
        this.yb = yb;
    }
    render(ctx) {

        let xb = this.xb;
        let yb = this.yb;
        let xe = this.xe;
        let ye = this.ye;

        super.render(ctx);
        const centerX = (xb + xe) / 2;
        const centerY = (yb + ye) / 2;
        const radiusX = Math.abs((xe - xb) / 2);
        const radiusY = Math.abs((ye - yb) / 2);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

    }
    compile() {
        let c = super.compile();
        c += `    txEllipse(`;
        c += `${compile_rel_x(this.xb)}, `;
        c += `${compile_rel_y(this.yb)}, `;
        c += `${compile_rel_x(this.xe)}, `
        c += `${compile_rel_y(this.ye)});\r\n`;

        return c;
    }
}

class Polygon extends Primitive {
    static polygons = -1;
    constructor(xb, yb, color, fill_color, line_width) {
        super(color, fill_color, line_width);
        this.points = [];
        this.points.push([xb, yb]);
        this.closed = false;
        this.points.push([xb, yb]);
        Polygon.polygons++;
        this.id = Polygon.polygons;
    }

    addPoint(x, y) {
        this.points.push([x, y]);

        let last_point = this.points[this.points.length - 1];
        let first_point = this.points[0];

        // Logics
        // xb-2.5 < x < xb+2.5
        // yb-2.5 < y < yb+2.5
        let cof = this.line_width / 2 + 2.5;
        let cond_x = ((first_point[0] - cof) < last_point[0]) && (last_point[0] < (first_point[0] + cof));
        let cond_y = ((first_point[1] - cof) < last_point[1]) && (last_point[1] < (first_point[1] + cof));
        let cond = cond_x && cond_y;

        if (cond) {
            this.points.pop();
            this.points.pop();
            this.closed = true;
        }
    }
    render(ctx) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);

        this.points.slice(1).forEach(point => ctx.lineTo(point[0], point[1]));

        if (this.closed) ctx.closePath();

        ctx.stroke();
        ctx.fill();

        if (!this.closed) {
            ctx.fillStyle = "rgb(192, 192, 192, 0.9)";
            ctx.beginPath();
            ctx.arc(this.points[0][0], this.points[0][1], this.line_width + 5, 0, 2 * Math.PI);
            ctx.fill();
        }

    }
    compile() {
        let c = super.compile();

        c += `    POINT polygon${this.id}[${this.points.length}] = {`;
        this.points.forEach((point, index) => {
            c += `{${compile_rel_x(point[0], true)}, ${compile_rel_y(point[1], true)}}`;
            if (index < this.points.length - 1) c += ", ";
        });

        c += "};\r\n";

        c += `    txPolygon(polygon${this.id}, ${this.points.length});\r\n`;

        return c;
    }
    move(xof, yof) {
        let npoints = []
        this.points.forEach(point => {
            npoints.push([point[0] + xof, point[1] + yof]);
        });
        this.points = npoints;
    }
}

const imagesPre=new Map();

class Character {
    static id=0;
    constructor(name, basepoint, objects, width, height) {
        this.id=Character.id++;
        this.name=name;
        this.basepoint=basepoint;
        this.objects=objects;
        this.width=width;
        this.height=height;
    }

    static fromTXCFile(data) {
        data=JSON.parse(binaryDecode(data));

        let objects=[];
        let types={"Line":Line,"Rectangle":Rectangle,"Circle":Circle,"Ellipse":Ellipse,"Polygon":Polygon};
        data.objects.forEach(element=>{
            let type=element.type;
            if (types[type]) {
                let object=new types[type];
                for(let i in element.properties) object[i]=element.properties[i];

                objects.push(object);
            }
        })
        return new Character(data.name, data.basepoint, objects, data.width, data.height);
    }
    compile() {

        compilerRuntime.basepoint=this.basepoint;
        
        function compile(name,objects) {
            let c = "/**\r\n * Autogenerated by TXCharacter-compiler (In part of TXMovie).\r\n * \r\n * https://github.com/A2020GK/TXCharacter\r\n * https://github.com/A2020GK/TXMovie\r\n */\r\n";
        
            c += `void character_${name}(double x, double y, double scaleX, double scaleY, bool mirror) {\r\n`;
            c += `    int mirrorCof = mirror ? 1: -1;\r\n\r\n`;
        
            objects.forEach(element => c += element.compile() + "\r\n");

            c += "}\r\n";
        
            let cp = `void character_${name}(double x, double y, double scaleX, double scaleY, bool mirror);`;
        
            return [c, cp];
        }
        return compile(this.name,this.objects);
        
        
    }
}

export default Character;
export {Primitive,Line,Rectangle,Circle,Ellipse,Polygon};