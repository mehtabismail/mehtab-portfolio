// Renders the home-screen icons and favicon.ico into public/ with headless Chrome
// (macOS path, like `npm run og`). Run: npm run icons
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const tmp = mkdtempSync(join(tmpdir(), 'icons-'))

function shot(page, size, out, transparent = false) {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${size},${size}`,
      ...(transparent ? ['--default-background-color=00000000'] : []),
      `--screenshot=${out}`,
      `file://${resolve(page)}`,
    ],
    { stdio: 'ignore' },
  )
}

shot('scripts/icons/icon.html', 180, 'public/apple-touch-icon.png')
shot('scripts/icons/icon.html', 192, 'public/icon-192.png')
shot('scripts/icons/icon.html', 512, 'public/icon-512.png')

// favicon.ico: a single 32×32 PNG wrapped in an ICO header (supported everywhere since Vista).
const png32 = join(tmp, 'favicon-32.png')
shot('scripts/icons/favicon.html', 32, png32, true)
const png = readFileSync(png32)
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // one image
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt8(0, 8) // palette
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(png.length, 14) // image size
header.writeUInt32LE(22, 18) // image offset
writeFileSync('public/favicon.ico', Buffer.concat([header, png]))

rmSync(tmp, { recursive: true, force: true })
console.log('wrote public/apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico')
