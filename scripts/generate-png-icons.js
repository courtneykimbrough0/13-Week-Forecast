const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure Node.js script to create valid PNG icons with background and design
function createPngBuffer(width, height, r, g, b) {
  // Create raw RGBA image data
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Calculate icon design elements: dark background (#090D16 = 9, 13, 22), emerald stroke (#10B981 = 16, 185, 129)
      const cx = width / 2;
      const cy = height / 2;
      const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      
      // Draw a subtle emerald wave trendline
      const normX = x / width;
      const normY = y / height;
      const trendY = 0.7 - 0.4 * Math.sin(normX * Math.PI * 0.85);
      const distFromTrend = Math.abs(normY - trendY) * height;

      if (distFromTrend < width * 0.025) {
        // Emerald line stroke
        rawData[pxOffset] = 16;
        rawData[pxOffset + 1] = 185;
        rawData[pxOffset + 2] = 129;
        rawData[pxOffset + 3] = 255;
      } else if (normY > trendY && distFromTrend < width * 0.2) {
        // Muted emerald glow under line
        rawData[pxOffset] = Math.min(255, Math.floor(16 * 0.4 + r * 0.6));
        rawData[pxOffset + 1] = Math.min(255, Math.floor(185 * 0.4 + g * 0.6));
        rawData[pxOffset + 2] = Math.min(255, Math.floor(129 * 0.4 + b * 0.6));
        rawData[pxOffset + 3] = 255;
      } else {
        // Background color
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  // Compress raw data with zlib
  const compressedData = zlib.deflateSync(rawData);

  // CRC32 helper function
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const typeAndData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write PNG files for PWA
const bgR = 9, bgG = 13, bgB = 22; // #090D16

const pwa192 = createPngBuffer(192, 192, bgR, bgG, bgB);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

const pwa512 = createPngBuffer(512, 512, bgR, bgG, bgB);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

const pwaMaskable = createPngBuffer(512, 512, bgR, bgG, bgB);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);

const appleTouch = createPngBuffer(180, 180, bgR, bgG, bgB);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

console.log('Successfully generated PWA PNG icons!');
