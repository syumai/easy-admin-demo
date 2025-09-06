// Easy Admin側のBuiltIn関数（公開したい機能）
const builtInFuncs = {
  async getCurrentUser() {
    // 実際の実装ではAPIを呼び出すが、ここではモックデータを返す
    await new Promise(resolve => setTimeout(resolve, 500)); // APIの遅延をシミュレート
    return {
      id: "user-123",
      name: "田中太郎", 
      email: "tanaka@example.com",
      role: "admin",
      avatar: "https://via.placeholder.com/40"
    };
  },

  async listUsers() {
    // 実際の実装ではAPIを呼び出すが、ここではモックデータを返す
    await new Promise(resolve => setTimeout(resolve, 800)); // APIの遅延をシミュレート
    return [
      {
        id: "user-123",
        name: "田中太郎",
        email: "tanaka@example.com", 
        role: "admin"
      },
      {
        id: "user-456", 
        name: "鈴木花子",
        email: "suzuki@example.com",
        role: "user"
      },
      {
        id: "user-789",
        name: "佐藤次郎", 
        email: "sato@example.com",
        role: "user"
      }
    ];
  },

  async createUser(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData
    };
    return newUser;
  }
};

// 型定義（TypeScriptの場合はこれをexportする）
// type BuiltInFuncs = typeof builtInFuncs;

// Client Originの許可リスト（実際の実装では設定ファイルから読み込む）
const allowedClientOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000", 
  "null" // file://プロトコルの場合
];

// iframe要素の取得
const iframe = document.getElementById("client-app");

// postMessageのリクエスト処理
window.addEventListener("message", async (event) => {
  console.log("Easy Admin: メッセージを受信", event);

  // セキュリティチェック: 送信元がiframeかどうか
  if (event.source !== iframe.contentWindow) {
    console.warn("Easy Admin: 不正な送信元からのメッセージ", event.source);
    return;
  }

  // セキュリティチェック: Originの検証（開発時は緩い設定）
  if (!allowedClientOrigins.includes(event.origin)) {
    console.warn("Easy Admin: 許可されていないOriginからのメッセージ", event.origin);
    return;
  }

  const reqMsg = event.data;
  console.log("Easy Admin: リクエストメッセージ", reqMsg);

  // メッセージの形式チェック
  if (!reqMsg || typeof reqMsg !== "object" || !reqMsg.operation || !reqMsg.id) {
    console.warn("Easy Admin: 無効なメッセージ形式", reqMsg);
    return;
  }

  let resMsg;

  try {
    // 指定された関数を取得して実行
    const func = builtInFuncs[reqMsg.operation];
    if (!func || typeof func !== "function") {
      throw new Error(`Unknown operation: ${reqMsg.operation}`);
    }

    // 関数を引数付きで実行
    const payload = await func(...(reqMsg.payload || []));
    
    resMsg = {
      id: reqMsg.id,
      operation: reqMsg.operation,
      payload
    };
    
    console.log("Easy Admin: 成功レスポンス", resMsg);
  } catch (error) {
    // エラーハンドリング
    resMsg = {
      id: reqMsg.id,
      operation: reqMsg.operation,
      error: {
        message: error.message,
        name: error.name
      }
    };
    
    console.log("Easy Admin: エラーレスポンス", resMsg);
  }

  // レスポンスを送信
  iframe.contentWindow.postMessage(resMsg, event.origin);
});

// iframe読み込み完了時の処理
iframe.addEventListener("load", async () => {
  console.log("Easy Admin: iframeの読み込み完了");
  
  // Easy Admin自身の現在のユーザー情報を表示
  try {
    const user = await builtInFuncs.getCurrentUser();
    document.getElementById("current-user-info").textContent = 
      `${user.name} (${user.email})`;
  } catch (error) {
    document.getElementById("current-user-info").textContent = 
      "ユーザー情報の取得に失敗しました";
  }
});

console.log("Easy Admin: スクリプトが読み込まれました");