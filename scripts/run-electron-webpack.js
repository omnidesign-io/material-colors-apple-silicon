#!/usr/bin/env node
/**
 * Webpack 4 needs OpenSSL legacy mode on Node 17+, but Electron rejects
 * NODE_OPTIONS=--openssl-legacy-provider. Strip NODE_OPTIONS only for the
 * Electron binary spawn; keep it for webpack / dev-server child processes.
 */
'use strict';

// Cursor (and some CI shells) set ELECTRON_RUN_AS_NODE=1 for the parent Node
// process. electron-webpack copies process.env into the real Electron app, which
// then breaks `require('electron').app`. Never forward that into Electron.
delete process.env.ELECTRON_RUN_AS_NODE;

const cp = require('child_process');
const path = require('path');

const electronBin = require('electron');
const origSpawn = cp.spawn;
cp.spawn = function patchedSpawn(command, args, options) {
  if (typeof command === 'string' && command === electronBin) {
    const opts = options && typeof options === 'object' ? { ...options } : {};
    const env = { ...(opts.env || process.env) };
    delete env.NODE_OPTIONS;
    delete env.ELECTRON_RUN_AS_NODE;
    opts.env = env;
    return origSpawn.call(cp, command, args, opts);
  }
  return origSpawn.call(cp, command, args, options);
};

const prev = process.env.NODE_OPTIONS || '';
if (!prev.includes('openssl-legacy-provider')) {
  process.env.NODE_OPTIONS = [prev, '--openssl-legacy-provider'].filter(Boolean).join(' ').trim();
}

require(path.join(__dirname, '..', 'node_modules', 'electron-webpack', 'out', 'cli.js'));
