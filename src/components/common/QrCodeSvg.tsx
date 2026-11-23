import React, { useMemo } from 'react';
import { generateQrMatrix } from '../../utils/qrGenerator';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  value,
  size = 180,
  className = '',
  ariaLabel = 'Official Service Token QR Code'
}) => {
  const { matrixSize, pathData } = useMemo(() => {
    try {
      const { size: mSize, modules } = generateQrMatrix(value);
      let d = '';
      for (let r = 0; r < mSize; r++) {
        for (let c = 0; c < mSize; c++) {
          if (modules[r][c]) {
            d += `M${c},${r}h1v1h-1z `;
          }
        }
      }
      return { matrixSize: mSize, pathData: d };
    } catch (e) {
      console.warn('QR code generation error:', e);
      return { matrixSize: 33, pathData: '' };
    }
  }, [value]);

  return (
    <div 
      className={`inline-block p-2 bg-white rounded-xl shadow-inner ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={`-2 -2 ${matrixSize + 4} ${matrixSize + 4}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        {/* Background */}
        <rect x="-2" y="-2" width={matrixSize + 4} height={matrixSize + 4} fill="#ffffff" />
        {/* QR Modules */}
        <path d={pathData} fill="#0f172a" />
      </svg>
    </div>
  );
};
