// src/polyfills.ts
import { Buffer } from 'buffer';

// assertの簡易実装（ブラウザ用）
const assert = (condition: any, message?: string) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

// assertに追加のメソッドを追加
(assert as any).equal = (actual: any, expected: any, message?: string) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, but got ${actual}`);
  }
};

(assert as any).ok = assert;
(assert as any).strictEqual = (assert as any).equal;

// TextDecoder2のpolyfill（WASMエラー対策）
if (!(window as any).TextDecoder2) {
  (window as any).TextDecoder2 = TextDecoder;
}

// crypto.randomFillSyncのpolyfill
const crypto = (window as any).crypto || (window as any).msCrypto;
if (crypto && !crypto.randomFillSync) {
  crypto.randomFillSync = (buffer: any) => {
    const array = new Uint8Array(buffer);
    crypto.getRandomValues(array);
    return buffer;
  };
}

// グローバルに設定
(window as any).global = window;
(window as any).Buffer = Buffer;
(window as any).assert = assert;
(window as any).process = {
  env: {},
  nextTick: (fn: Function) => setTimeout(fn, 0),
  browser: true,
  version: '16.0.0',
  versions: { node: '16.0.0' },
  platform: 'browser',
};

// require関数のmock（一部のライブラリが必要とする場合）
if (!(window as any).require) {
  (window as any).require = (moduleName: string) => {
    console.warn(`require('${moduleName}') called in browser environment`);
    return {};
  };
}
