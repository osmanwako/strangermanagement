import React, { useEffect, useRef } from 'react';

export default function BarcodeGenerator({ value, width = 2, height = 100, displayValue = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Simple barcode generation (Code 128 style)
    const generateBarcode = (text) => {
      const patterns = {
        '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
        '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
        '8': '10001100100', '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
        'C': '10110011100', 'D': '10011011100', 'E': '10011001110', 'F': '10111001000',
        'G': '10011101000', 'H': '10011100100', 'I': '11001110010', 'J': '11001011100',
        'K': '11001001110', 'L': '11011100100', 'M': '11001110100', 'N': '11101101110',
        'O': '11101001100', 'P': '11100101100', 'Q': '11100100110', 'R': '11101100100',
        'S': '11100110100', 'T': '11100110010', 'U': '11011011000', 'V': '11011000110',
        'W': '11000110110', 'X': '10100011000', 'Y': '10001011000', 'Z': '10001000110',
        '-': '10110001000', '.': '10001101000', ' ': '10001100010'
      };

      let barcode = '11010010000'; // Start pattern
      
      for (let char of text.toUpperCase()) {
        barcode += patterns[char] || patterns['0'];
      }
      
      barcode += '1100011101011'; // Stop pattern
      
      return barcode;
    };

    const barcodePattern = generateBarcode(value);
    const barWidth = width;
    const canvasWidth = barcodePattern.length * barWidth;
    const canvasHeight = height + (displayValue ? 20 : 0);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw barcode
    ctx.fillStyle = 'black';
    for (let i = 0; i < barcodePattern.length; i++) {
      if (barcodePattern[i] === '1') {
        ctx.fillRect(i * barWidth, 0, barWidth, height);
      }
    }

    // Draw text
    if (displayValue) {
      ctx.fillStyle = 'black';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(value, canvasWidth / 2, height + 15);
    }
  }, [value, width, height, displayValue]);

  return (
    <div className="barcode-container">
      <canvas ref={canvasRef} className="border border-gray-300 rounded" />
    </div>
  );
}