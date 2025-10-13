'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { unlockSong } from '@/lib/api';

export default function UnlockSongPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    songId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // エラーメッセージをクリア
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // バリデーション
    if (!formData.songId) {
      setError('楽曲IDを入力してください');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('パスワードを入力してください');
      setIsLoading(false);
      return;
    }

    try {
      await unlockSong(formData.songId, formData.password);
      // 成功時はモーダルを表示
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Unlock error:', err);
      // error_code が wrong_password の場合
      if (err.error_code === 'wrong_password') {
        setError('パスワードが違います');
      } else {
        setError(err.message || '楽曲の開放に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    router.push('/share');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#1C1C1E' }}>
      {/* ヘッダー */}
      <header style={{ backgroundColor: '#1C1C1E', borderBottomColor: '#3A3A3C' }} className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              戻る
            </button>
            <h1 className="text-xl font-bold text-white">楽曲の開放</h1>
            <div className="w-16"></div> {/* スペーサー */}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-xl shadow-lg p-8 border" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2C2C2E' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">楽曲を開放する</h2>
              <p className="text-gray-400 text-sm">
                ステッカー裏面の楽曲IDとパスワードを入力してください
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 楽曲ID */}
              <div>
                <label htmlFor="songId" className="block text-sm font-medium text-white mb-2">
                  楽曲ID
                </label>
                <input
                  type="text"
                  id="songId"
                  name="songId"
                  value={formData.songId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                  placeholder="例: 123"
                  disabled={isLoading}
                />
              </div>

              {/* パスワード */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  パスワード
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                  placeholder="パスワードを入力"
                  disabled={isLoading}
                />
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              {/* 登録ボタン */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed border"
                style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>開放中...</span>
                  </div>
                ) : (
                  '楽曲を開放する'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 成功モーダル */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="rounded-xl shadow-2xl p-8 max-w-sm w-full border" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">成功しました！</h3>
              <p className="text-gray-400 mb-6">
                楽曲が開放されました
              </p>
              <button
                onClick={handleBackToList}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-98 border"
                style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
              >
                共有楽曲一覧に戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

