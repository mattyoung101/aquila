const tsopNum = 24;

// TODO make this a utils library
function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function scale(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export function redrawTsopDisplay(canvas){
    /** @type CanvasRenderingContext2D */
    const ctx = canvas.getContext("2d");
    const tsopAngleIncrement = 360 / tsopNum;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 10;
   
    for (let i = 0; i < tsopNum; i++){
        let startingAngle = (tsopAngleIncrement * i) - 90 - 5;
        ctx.beginPath();
        ctx.arc(300, 200, 190, toRadians(startingAngle), toRadians(startingAngle + 10));
        ctx.strokeStyle = `rgba(${scale(i, 0, tsopNum, 0, 255)}, 0, 0, 1)`
        ctx.stroke();
        ctx.closePath();
    }
}