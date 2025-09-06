/**
 * Easy Admin SDK TypeScript型定義
 */

// ユーザー型定義
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
}

// Easy Admin Built-in 関数の型定義
export interface EasyAdminBuiltInFuncs {
    getCurrentUser(): Promise<User>;
    listUsers(): Promise<User[]>;
    createUser(userData: Omit<User, 'id'>): Promise<User>;
}

// グローバル宣言
declare global {
    interface Window {
        easyAdminClient: EasyAdminBuiltInFuncs;
    }
}

// メインエクスポート
export declare const easyAdminClient: EasyAdminBuiltInFuncs;