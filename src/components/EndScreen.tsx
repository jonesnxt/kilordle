import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ShareButton = styled.button`
  margin: 10px 0;
  background-color: #0fb30f;
  color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  outline: none;
  font-size: 1.5em;
  cursor: pointer;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);

  :hover {
    opacity: 0.6;
  }

  &:active {
    color: lightgray;
  }
`;

function EndScreen({ progressHistory }: { progressHistory: number[] }) {
  const guesses = progressHistory.length;
  const [canvasURL, setCanvasURL] = useState('');
  const canvasResult = useRef<Blob | null>(null);

  const displayWidth = 525;
  const titleHeight = 20;
  const displayHeight = 275 + titleHeight;
  const maxColumns = 50;
  const actualColumns = Math.min(maxColumns, guesses);
  const rows = 25;
  const fontFamily = 'sans-serif';

  const mmts = {
    // measurements
    height: displayHeight,
    nonTitleHeight: displayHeight - titleHeight,
    width: displayWidth,
    leftGutter: 30,
    bottomGutter: 30,
    urlHeight: 15,
    margin: 3,
    lineWidth: 1,
    fontSize: 10,
    gridLeftEdge: 0,
    gridWidth: 0,
    gridBottomEdge: 0,
    gridHeight: 0,
    squareSide: 0,
    squarePadding: 1,
  };
  mmts.gridLeftEdge = mmts.leftGutter + mmts.lineWidth + mmts.margin / 2;
  mmts.gridBottomEdge = mmts.bottomGutter + mmts.lineWidth;
  mmts.gridWidth =
    mmts.width - mmts.leftGutter - mmts.leftGutter / 2 - mmts.margin;
  mmts.gridHeight = mmts.nonTitleHeight - mmts.gridBottomEdge;
  mmts.squareSide = mmts.gridHeight / rows;

  // scale adjustment
  let mmt: keyof typeof mmts;
  for (mmt in mmts) {
    mmts[mmt] *= devicePixelRatio * 2;
  }

  useEffect(() => {
    const canvas = document.createElement('canvas');
    if (!canvas) return;
    canvas.width = mmts.width;
    canvas.height = mmts.height;
    const context = canvas.getContext('2d');
    if (!context) return;
    // draw background (white)
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // create margin
    context.scale(0.95, 0.95);
    context.translate(0.025 * mmts.width, 0.025 * mmts.height);
    // create title
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.font = `${mmts.fontSize * 1.5}px ${fontFamily}`;
    context.fillText(
      `I beat Kilordle in ${guesses} guesses :')`,
      mmts.width / 2,
      0
    );
    context.translate(0, mmts.fontSize * 1.5);
    context.font = `${mmts.fontSize}px ${fontFamily}`;
    // draw numbers
    context.textBaseline = 'alphabetic';
    context.textAlign = 'right';
    context.fillText(
      '0',
      mmts.leftGutter - mmts.margin,
      mmts.nonTitleHeight - mmts.margin - mmts.urlHeight
    );
    context.textBaseline = 'top';
    context.fillText('1000', mmts.leftGutter - mmts.margin, mmts.margin);
    context.textBaseline = 'alphabetic';
    context.textAlign = 'center';
    context.fillText(
      String(guesses),
      mmts.gridLeftEdge +
        actualColumns * mmts.squareSide +
        mmts.squarePadding -
        mmts.squareSide / 2,
      mmts.nonTitleHeight - mmts.margin - mmts.urlHeight
    );
    // draw axes
    context.fillRect(
      mmts.leftGutter,
      0,
      mmts.lineWidth,
      mmts.nonTitleHeight - mmts.urlHeight
    );
    context.fillRect(
      mmts.leftGutter / 2,
      mmts.nonTitleHeight - mmts.bottomGutter,
      mmts.width - mmts.leftGutter / 2,
      mmts.lineWidth
    );
    // draw url of site
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.font = `${mmts.urlHeight}px ${fontFamily}`;
    context.fillText(
      'https://jonesnxt.github.io/kilordle/',
      mmts.leftGutter + mmts.gridWidth / 2,
      mmts.nonTitleHeight - mmts.margin
    );
    // draw grid of squares
    const gradient = context.createRadialGradient(
      mmts.gridLeftEdge + (3 / 4) * mmts.gridWidth,
      mmts.gridHeight - mmts.gridHeight / 4,
      mmts.gridHeight / 6,
      mmts.gridLeftEdge + (3 / 4) * mmts.gridWidth,
      mmts.gridHeight - mmts.gridHeight / 4,
      mmts.gridHeight
    );
    gradient.addColorStop(0, '#22b512');
    gradient.addColorStop(0.4, '#2bb31d');
    gradient.addColorStop(1, '#218c16');
    context.fillStyle = gradient;
    const drawnSquareSide = mmts.squareSide - mmts.squarePadding * 2;
    const finalHeight = progressHistory[progressHistory.length - 1];
    for (let x = 0; x < actualColumns; x++) {
      const wordsGotten =
        progressHistory[Math.floor(guesses * (x / actualColumns))];
      const columnSquares = Math.round(wordsGotten * (rows / finalHeight));
      for (let y = rows; y > rows - columnSquares; y--) {
        const xPos =
          mmts.gridLeftEdge + x * mmts.squareSide + mmts.squarePadding;
        const yPos = (y - 1) * mmts.squareSide + mmts.squarePadding;
        context.fillRect(xPos, yPos, drawnSquareSide, drawnSquareSide);
      }
    }
    canvas.toBlob((blob) => {
      if (blob) {
        let oldCanvasURL = canvasURL;
        setCanvasURL(URL.createObjectURL(blob));
        canvasResult.current = blob;
        URL.revokeObjectURL(oldCanvasURL);
      }
    });
  }, [progressHistory]);

  const [buttonText, setButtonText] = useState('Share Results');

  const getFileName = () => {
    const now = new Date();
    return `kilordle-${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}.png`;
  };

  /** download results to share them the old-fashioned way */
  const downloadResults = () => {
    const dl = document.createElement('a');
    dl.download = getFileName();
    dl.href = canvasURL;
    dl.click();
  };

  /** try to copy results to clipboard; returns true on success */
  const copyResults = async (png: Blob): Promise<boolean> => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [png.type]: png,
        }),
      ]);
    } catch {
      return false;
    }
    setButtonText('Copied to clipboard');
    return true;
  };

  /** try to activate the system's built-in share menu; returns true on success */
  const mobileShareResults = async (png: Blob): Promise<boolean> => {
    if (!('share' in navigator)) return false;
    // Chrome and Edge on Windows 10 support the navigator.share API but
    // tragically, the resulting pop-up is very bad, unless you really want your
    // results emailed. So we will keep this method mobile-focused
    if (navigator.userAgent.includes('Windows')) return false;
    const shareable: ShareData = {
      files: [new File([png], getFileName(), { type: 'image/png' })],
    };
    if (!navigator.canShare(shareable)) return false;
    try {
      await navigator.share(shareable);
      return true;
    } catch {
      return false;
    }
  };

  const shareResults = async () => {
    if (!canvasResult.current) return;
    if (await mobileShareResults(canvasResult.current)) return;
    if (await copyResults(canvasResult.current)) return;
    downloadResults();
  };

  return (
    <>
      <img
        src={canvasURL}
        alt="Congratulations, you have beaten Kilordle!"
        style={{ width: displayWidth, maxWidth: '95%', height: 'auto' }}
      />
      <ShareButton onClick={shareResults}>{buttonText}</ShareButton>
    </>
  );
}

export default EndScreen;
