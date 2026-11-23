/**
 * Self-contained QR Code Generator (Version 4, 33x33 Matrix, Byte Encoding)
 * Produces genuine, scannable QR Code matrices for URLs and service tokens.
 * Zero external dependencies.
 */

export interface QrMatrix {
  size: number;
  modules: boolean[][];
}

// Galois Field GF(256) tables with primitive polynomial 0x11d (285)
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
})();

function gMult(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

function polyMultiply(p1: number[], p2: number[]): number[] {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gMult(p1[i], p2[j]);
    }
  }
  return result;
}

function getGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    poly = polyMultiply(poly, [1, EXP_TABLE[i]]);
  }
  return poly;
}

function calculateReedSolomon(data: number[], ecCount: number): number[] {
  const genPoly = getGeneratorPoly(ecCount);
  const remainder = new Array(ecCount).fill(0);
  const msg = [...data, ...remainder];

  for (let i = 0; i < data.length; i++) {
    const lead = msg[i];
    if (lead !== 0) {
      for (let j = 0; j < genPoly.length; j++) {
        msg[i + j] ^= gMult(genPoly[j], lead);
      }
    }
  }
  return msg.slice(data.length);
}

/**
 * Encodes text into a standard Version 4 (33x33) QR Code matrix with Level M error correction.
 * Capacity: Up to 62 bytes.
 */
export function generateQrMatrix(text: string): QrMatrix {
  const size = 33; // Version 4 QR Code size: 21 + 4*(V-1) = 33
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunctionModule: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setModule(r: number, c: number, val: boolean, isFunc = true) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = val;
      if (isFunc) isFunctionModule[r][c] = true;
    }
  }

  // 1. Finder Patterns (7x7) + Separators
  const finders = [[0, 0], [size - 7, 0], [0, size - 7]];
  for (const [row, col] of finders) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
            const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
            setModule(nr, nc, isBorder || isCenter);
          } else {
            setModule(nr, nc, false); // White separator
          }
        }
      }
    }
  }

  // 2. Alignment Pattern for Version 4 at (26, 26)
  const alignCenter = 26;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      setModule(alignCenter + r, alignCenter + c, isBorder || isCenter);
    }
  }

  // 3. Timing Patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0);
    setModule(i, 6, i % 2 === 0);
  }

  // 4. Dark Module
  setModule(size - 8, 8, true);

  // 5. Reserve Format Info areas
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      setModule(8, i, false);
      setModule(i, 8, false);
    }
  }
  for (let i = 0; i < 8; i++) {
    setModule(8, size - 1 - i, false);
    setModule(size - 1 - i, 8, false);
  }

  // 6. Encode Data (Byte Mode 0100)
  const bytes = new TextEncoder().encode(text.slice(0, 60));
  const bitStream: number[] = [];

  // Mode indicator: 0100 (Byte mode)
  bitStream.push(0, 1, 0, 0);

  // Character count indicator: 8 bits for Version 4 byte mode
  const len = bytes.length;
  for (let i = 7; i >= 0; i--) {
    bitStream.push((len >> i) & 1);
  }

  // Data bytes
  for (const b of bytes) {
    for (let i = 7; i >= 0; i--) {
      bitStream.push((b >> i) & 1);
    }
  }

  // Terminator (up to 4 zeroes)
  const totalDataBits = 64 * 8; // 64 data codewords in Version 4-M (512 bits)
  const termLength = Math.min(4, totalDataBits - bitStream.length);
  for (let i = 0; i < termLength; i++) bitStream.push(0);

  // Pad to byte boundary
  while (bitStream.length % 8 !== 0) bitStream.push(0);

  // Pad codewords (0xEC, 0x11)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitStream.length < totalDataBits) {
    const pad = padBytes[padIdx % 2];
    for (let i = 7; i >= 0; i--) {
      bitStream.push((pad >> i) & 1);
    }
    padIdx++;
  }

  // Group into codewords
  const dataCodewords: number[] = [];
  for (let i = 0; i < bitStream.length; i += 8) {
    let byteVal = 0;
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bitStream[i + b];
    }
    dataCodewords.push(byteVal);
  }

  // 7. Error Correction (Version 4-M uses 2 blocks with 18 EC codewords each, total 36 EC)
  // For simplicity and resilience, compute EC across blocks:
  const ec1 = calculateReedSolomon(dataCodewords.slice(0, 32), 18);
  const ec2 = calculateReedSolomon(dataCodewords.slice(32, 64), 18);

  // Interleave data codewords and EC codewords
  const finalCodewords: number[] = [];
  for (let i = 0; i < 32; i++) {
    finalCodewords.push(dataCodewords[i]);
    finalCodewords.push(dataCodewords[i + 32]);
  }
  for (let i = 0; i < 18; i++) {
    finalCodewords.push(ec1[i]);
    finalCodewords.push(ec2[i]);
  }

  // Convert final codewords to bits
  const finalBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      finalBits.push((cw >> i) & 1);
    }
  }

  // 8. Place data bits in matrix (Right to Left, zig-zag)
  let bitIdx = 0;
  let upward = true;

  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing column

    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const col of [right, right - 1]) {
        if (!isFunctionModule[r][col]) {
          const bit = bitIdx < finalBits.length ? finalBits[bitIdx++] === 1 : false;
          // Apply standard Mask 0: (row + col) % 2 == 0
          const mask = (r + col) % 2 === 0;
          modules[r][col] = bit !== mask;
        }
      }
    }
    upward = !upward;
  }

  // 9. Format Information: Level M, Mask 0 -> Format bits: 101010000010010 ^ 101010000010010 = 0
  // Standard format string for (M, 0) is 101010000010010 XOR 101010000010010 = 000000000000000
  // Standard raw 15-bit format for (M, 0) with BCH error code:
  // (M = 00, Mask 0 = 000) -> 00000 -> BCH 101010000010010 (exact standard)
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];

  // Top-left finder format
  const tlCoords = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = tlCoords[i];
    setModule(r, c, formatBits[i] === 1, true);
  }

  // Split format around other finders
  for (let i = 0; i < 7; i++) {
    setModule(size - 1 - i, 8, formatBits[i] === 1, true);
  }
  for (let i = 0; i < 8; i++) {
    setModule(8, size - 8 + i, formatBits[7 + i] === 1, true);
  }

  return { size, modules };
}
