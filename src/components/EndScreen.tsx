import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

const green = "#0fb30f";
const ShareButton = styled.button`
margin: 10px 0;
background-color: ${green};
color: white;
border-radius: 3px;
font-size: 1.5em;
&:active {
    color: lightgray;
}`;

function EndScreen({progressHistory}: {progressHistory: number[]}){
    const guesses = progressHistory.length;
    const [canvasURL, setCanvasURL] = useState("");
    const canvasResult = useRef<Blob|null>(null);

    const displayWidth = 525;
    const displayHeight = 250+20;
    const maxColumns = 50;
    const actualColumns = Math.min(maxColumns, guesses);
    const rows = 25;

    const mmts = {  // measurements
        height: displayHeight,
        nonTitleHeight: displayHeight-20,
        width: displayWidth,
        leftGutter: 30,
        bottomGutter: 15,
        margin: 3,
        lineWidth: 1,
        fontSize: 10,
        gridLeftEdge: 0,
        gridWidth: 0,
        gridBottomEdge: 0,
        gridHeight: 0,
        squareSide: 0,
        squarePadding: 1
    };
    mmts.gridLeftEdge = mmts.leftGutter + mmts.lineWidth + mmts.margin/2;
    mmts.gridBottomEdge = mmts.bottomGutter + mmts.lineWidth;
    mmts.gridWidth = mmts.width-mmts.leftGutter-mmts.leftGutter/2-mmts.margin;
    mmts.gridHeight = mmts.nonTitleHeight-mmts.gridBottomEdge;
    mmts.squareSide = mmts.gridHeight/rows;

    // scale adjustment
    let mmt: keyof typeof mmts;
    for (mmt in mmts){
        mmts[mmt] *= devicePixelRatio*2;
    }

    useEffect(() => {
        const canvas = document.createElement("canvas");
        if (!canvas) return;
        canvas.width = mmts.width;
        canvas.height = mmts.height;
        const context = canvas.getContext('2d');
        if (!context) return;
        console.log("drawing to canvas");
        console.log("progress history is", progressHistory);
        // draw background (white)
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // create margin
        context.scale(0.95, 0.95);
        context.translate(0.025*mmts.width, 0.025*mmts.height);
        // create title
        context.fillStyle = "#000000";
        context.textAlign = "center";
        context.textBaseline = "top";
        context.font = `${mmts.fontSize*1.5}px sans-serif`
        context.fillText(`I beat Kilordle in ${guesses} guesses :')`, mmts.width/2, 0);
        context.translate(0, mmts.fontSize*1.5);
        // setup fonts, colors
        context.font = `${mmts.fontSize}px sans-serif`
        // draw numbers
        context.textBaseline="alphabetic";
        context.textAlign = "right";
        context.fillText("0", mmts.leftGutter-mmts.margin, mmts.nonTitleHeight-mmts.margin);
        context.textBaseline = "top"
        context.fillText("1000", mmts.leftGutter-mmts.margin, mmts.margin);
        context.textBaseline = "alphabetic";
        context.textAlign = "center";
        context.fillText(String(guesses), mmts.gridLeftEdge + actualColumns*mmts.squareSide+mmts.squarePadding-mmts.squareSide/2, mmts.nonTitleHeight-mmts.margin);
        // draw axes
        context.fillRect(mmts.leftGutter, 0, mmts.lineWidth, mmts.nonTitleHeight);
        context.fillRect(mmts.leftGutter/2, mmts.nonTitleHeight-mmts.bottomGutter, mmts.width-mmts.leftGutter, mmts.lineWidth);
        // draw url of site
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.font = `${mmts.fontSize*1.25}px sans-serif`
        context.fillText("https://jonesnxt.github.io/kilordle/", mmts.leftGutter+mmts.gridWidth/2, mmts.nonTitleHeight-mmts.margin);
        // draw grid of squares
        context.fillStyle = "#0fb30f";
        const drawnSquareSide = mmts.squareSide - mmts.squarePadding*2;
        const finalHeight = progressHistory[progressHistory.length-1];
        for (let x=0; x<actualColumns; x++){
            const wordsGotten = progressHistory[Math.floor(guesses*(x/actualColumns))];
            const columnSquares = Math.round(wordsGotten*(rows/finalHeight));
            for (let y=rows; y>rows-columnSquares; y--){
                const xPos = mmts.gridLeftEdge + x*mmts.squareSide+mmts.squarePadding;
                const yPos = (y-1)*mmts.squareSide+mmts.squarePadding;
                context.fillRect(xPos, yPos, drawnSquareSide, drawnSquareSide);
            }
        }
        canvas.toBlob(blob => {
            if (blob){
                let oldCanvasURL = canvasURL;
                setCanvasURL(URL.createObjectURL(blob));
                canvasResult.current = blob;
                URL.revokeObjectURL(oldCanvasURL);
            }
        });
    }, [progressHistory]);
    const shareResults = () => {
        if (canvasResult.current){
            try {
                navigator.clipboard.write([
                    new ClipboardItem({
                        [canvasResult.current.type]: canvasResult.current
                    })
                ]);
            } catch {
                const dl = document.createElement("a");
                dl.download = "kilordle.png";
                dl.href = canvasURL;
                dl.click();
            }
        }
    };
    return (<>
            <img
                src={canvasURL}
                style={{width: displayWidth, height: displayHeight}} 
            />
            <ShareButton onClick={shareResults}>Share Results</ShareButton>
        </>
    )
}

export default EndScreen;
