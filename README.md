# Easy Admin Demo

ProxyによるWindow間RPC機構の実装デモプロジェクト

## プロジェクト構成

- `easy-admin/`: Easy Admin側（親ウィンドウ）のファイル
- `client-app/`: 顧客アプリ（iframe側）のファイル  
- `sdk/`: SDK（Proxyを使ったRPC機構）のファイル

## 実行方法

1. HTTPサーバーを起動してeasy-admin/index.htmlにアクセス
2. iframeで組み込まれた顧客アプリがWindow間通信でEasy Adminの機能を呼び出す

## 機能

- `getCurrentUser()`: ログイン中ユーザー情報の取得
- `listUsers()`: ユーザー一覧の取得
- Proxyを使った透過的なRPC呼び出し
- セキュリティ機構（Origin検証、ID付与）