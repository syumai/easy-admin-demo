/**
 * Easy Admin SDK
 * Proxyを使ったWindow間RPC機構の実装
 */

// Easy AdminのOrigin設定（実際の実装では設定ファイルから読み込む）
const EASY_ADMIN_ORIGIN = window.location.origin; // 同一Originの場合
// const EASY_ADMIN_ORIGIN = "https://easy-admin.example.com"; // 実際のEasy AdminのOrigin

/**
 * リクエストIDを生成する関数
 */
function generateRequestId() {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * postMessageを使ったリクエスト送信関数を作成する
 * @param {string} operation - 実行する操作名
 * @returns {Function} - リクエスト送信関数
 */
function createRequestSender(operation) {
    return (...payload) => {
        return new Promise((resolve, reject) => {
            const requestId = generateRequestId();
            
            console.log(`SDK: ${operation}() の呼び出しを開始`, { operation, payload, requestId });

            // レスポンス待ち受けハンドラー
            const responseHandler = (event) => {
                console.log("SDK: メッセージを受信", event);

                // セキュリティチェック: 送信元Origin
                if (event.origin !== EASY_ADMIN_ORIGIN) {
                    console.warn("SDK: 不正なOriginからのメッセージ", event.origin);
                    return;
                }

                const resMsg = event.data;

                // レスポンスメッセージの形式チェック
                if (!resMsg || typeof resMsg !== "object" || resMsg.id !== requestId) {
                    return; // 関係ないメッセージは無視
                }

                console.log(`SDK: ${operation}() のレスポンスを受信`, resMsg);

                // イベントリスナーを削除
                window.removeEventListener("message", responseHandler);

                // エラーレスポンスの処理
                if (resMsg.error) {
                    const error = new Error(resMsg.error.message || "Unknown error");
                    error.name = resMsg.error.name || "EasyAdminError";
                    console.error(`SDK: ${operation}() でエラー`, error);
                    reject(error);
                    return;
                }

                // 成功レスポンスの処理
                console.log(`SDK: ${operation}() の成功`, resMsg.payload);
                resolve(resMsg.payload);
            };

            // レスポンス待ち受けハンドラーを登録
            window.addEventListener("message", responseHandler);

            // リクエストメッセージを構築
            const reqMsg = {
                id: requestId,
                operation,
                payload
            };

            console.log("SDK: リクエストメッセージを送信", reqMsg);

            // 親ウィンドウ（Easy Admin）にリクエストを送信
            window.parent.postMessage(reqMsg, EASY_ADMIN_ORIGIN);
        });
    };
}

/**
 * Proxyを使ったRPCクライアントの作成
 * プロパティアクセスに対して、自動的にpostMessage呼び出しを行う関数を返す
 */
const easyAdminClient = new Proxy({}, {
    get(target, prop) {
        // プロパティ名が文字列でない場合は無視
        if (typeof prop !== 'string') {
            return undefined;
        }

        console.log(`SDK: ${prop} プロパティにアクセス`);

        // プロパティ名をoperationとして、リクエスト送信関数を作成して返す
        return createRequestSender(prop);
    }
});

/**
 * TypeScript用の型定義（コメント形式）
 * 実際のTypeScriptプロジェクトでは、これらを別ファイルに分離
 */

/*
// ユーザー型定義
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
}

// Easy Admin Built-in 関数の型定義
interface EasyAdminBuiltInFuncs {
    getCurrentUser(): Promise<User>;
    listUsers(): Promise<User[]>;
    createUser(userData: Omit<User, 'id'>): Promise<User>;
}

// エクスポートする型
declare const easyAdminClient: EasyAdminBuiltInFuncs;
*/

// グローバルに公開
window.easyAdminClient = easyAdminClient;

console.log("SDK: Easy Admin SDK が読み込まれました");

// ES Modules形式でのエクスポート（必要に応じて）
// export { easyAdminClient };