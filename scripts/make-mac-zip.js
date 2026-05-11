#!/usr/bin/env node
const archiver = require('archiver');
const fs = require('fs');
const plist = require('plist');
const path = require('path');

function findMacAppPaths() {
  const distRoot = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distRoot)) {
    throw new Error(`Missing ${distRoot}; run electron-builder first`);
  }
  const subdirs = ['mac-arm64', 'mac', 'mac-x64'];
  for (const sub of subdirs) {
    const macDir = path.join(distRoot, sub);
    if (!fs.existsSync(macDir)) {
      continue;
    }
    const appFilename = fs.readdirSync(macDir).find(f => f.endsWith('.app'));
    if (appFilename) {
      return { macDir, appFilename };
    }
  }
  throw new Error('No .app found under dist/mac*, dist/mac-arm64, or dist/mac-x64');
}

const { macDir, appFilename } = findMacAppPaths();
const appPath = path.join(macDir, appFilename);
let pl = plist.parse(fs.readFileSync(path.join(appPath, 'Contents', 'Info.plist'), { encoding: 'utf-8' }));
let version = pl['CFBundleVersion'];

console.log(`Zipping up ${appFilename}, version ${version}`);
let zipPath = `./dist/${version}.zip`;
let zipStream = fs.createWriteStream(zipPath)
  .on('warning', err => { throw err; })
  .on('error', err => { throw err; })
  .on('close', () => console.log(`Done zipping: ${path.resolve(zipPath)}`));
let archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(zipStream);
archive.directory(appPath, appFilename);
archive.finalize();
