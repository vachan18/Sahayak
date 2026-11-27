import { useMemo } from 'react';
import { generateQrMatrix } from '../../utils/qrGenerator';
import { cx } from '../../ui/cx';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/** Real, scannable QR code drawn as one SVG path. Always black on white so every scanner reads it. */
export const QrCodeSvg = ({ value, size = 180, className, ariaLabel = 'QR code' }: QrCodeSvgProps) => {
  const { matrixSize, pathData } = useMemo(() => {
    try {
      const { size: mSize, modules } = generateQrMatrix(value);
      let d = '';
      for (let r = 0; r < mSize; r++) {
        for (let c = 0; c < mSize; c++) {
          if (modules[r][c]) d += `M${c},${r}h1v1h-1z`;
        }
      }
      return { matrixSize: mSize, pathData: d };
    } catch (e) {
      console.warn('QR code generation error:', e);
      return { matrixSize: 33, pathData: '' };
    }
  }, [value]);

  return (
    <div className={cx('inline-block p-2.5 bg-white rounded-md', className)} style={{ width: size, height: size }} role="img" aria-label={ariaLabel}>
      <svg viewBox={`-2 -2 ${matrixSize + 4} ${matrixSize + 4}`} className="w-full h-full" shapeRendering="crispEdges" aria-hidden>
        <rect x="-2" y="-2" width={matrixSize + 4} height={matrixSize + 4} fill="#ffffff" />
        <path d={pathData} fill="#111111" />
      </svg>
    </div>
  );
};

export default QrCodeSvg;
