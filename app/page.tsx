'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-blue-900 text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* ヘッダー */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-blue-900">NFC Sticker</h1>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-blue-700">こんにちは、{user?.name}さん</span>
            <Link
              href="/auth/logout"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ログアウト
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              新規登録
            </Link>
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            音楽を共有しよう
          </h2>
          <p className="text-xl text-blue-700 mb-8">
            NFCステッカーを使って、簡単に音楽を共有できます
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-blue-600 mb-6">
                共有された楽曲を確認したり、新しい楽曲を共有したりできます
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/home"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  共有楽曲を見る
                </Link>
                <Link
                  href="/share"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  楽曲を共有する
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-blue-600 mb-6">
                まずはログインして、音楽の世界を楽しみましょう
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  新規登録
                </Link>
              </div>
            </div>
          )}

          {/* デモ用のプレイヤーリンク */}
          <div className="mt-12 pt-8 border-t border-blue-200">
            <p className="text-blue-500 mb-4">デモ用プレイヤー</p>
            <Link
              href="/player/1"
              className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              プレイヤーを試す
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
