'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logout as apiLogout } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await apiLogout();
      authLogout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: '#1C1C1E' }}>
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#1C1C1E' }}>
      {/* ヘッダー */}
      <header className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#3A3A3C' }}>
        <h1 className="text-2xl font-bold text-white">NFC Sticker</h1>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">こんにちは、{user?.name}さん</span>
            <button
              onClick={handleLogout}
              className="text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-70 border"
              style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-70 border"
              style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90 border"
              style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
            >
              新規登録
            </Link>
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            マジでいいバンドを俺らが広めよう
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            ステッカーですぐに友達に聞かせることができる！
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-gray-400 mb-6">
                共有された楽曲を確認したり、新しい楽曲を共有したりできる！
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/home"
                  className="text-white px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 border"
                  style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
                >
                  共有楽曲を見る
                </Link>
                <Link
                  href="/share"
                  className="text-white px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-70 border"
                  style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                >
                  楽曲を共有する
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400 mb-6">
                まずはログインして、音楽の世界を楽しみましょう
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="text-white px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 border"
                  style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-white px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-70 border"
                  style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                >
                  新規登録
                </Link>
              </div>
            </div>
          )}

          {/* デモ用のプレイヤーリンク */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: '#3A3A3C' }}>
            <p className="text-gray-400 mb-4">デモ用プレイヤー</p>
            <Link
              href="/player/1"
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-70 border"
              style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
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
