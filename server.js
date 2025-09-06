#!/usr/bin/env node
/**
 * Easy Admin Demo 用の簡単なHTTPサーバー (Node.js版)
 */
const express = require('express');
const path = require('path');
const open = require('open');

const PORT = 3000;
const app = express();

// CORSヘッダーを追加（開発時のみ）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 静的ファイルを提供
app.use(express.static('.'));

// デフォルトルートを easy-admin にリダイレクト
app.get('/', (req, res) => {
  res.redirect('/easy-admin/');
});

app.listen(PORT, () => {
  console.log('Easy Admin Demo サーバーを開始しました');
  console.log(`URL: http://localhost:${PORT}/easy-admin/`);
  console.log('Ctrl+C で停止');
  
  // ブラウザを自動で開く
  open(`http://localhost:${PORT}/easy-admin/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nサーバーを停止しました');
  process.exit(0);
});