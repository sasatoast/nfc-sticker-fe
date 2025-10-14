'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: contextLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      // 認証レスポンスからユーザー情報を取得してAuthContextに保存
      contextLogin({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      });
      router.push('/home'); // ログイン後はホーム画面へ
    } catch (err: any) {
      // エラーメッセージを設定
      if (err.message) {
        setError(err.message);
      } else {
        setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="w-full max-w-md">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NFC Sticker</h1>
          <p className="text-gray-300">音楽を共有しよう</p>
        </div>

        {/* ログインフォーム */}
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            ログイン
          </h2>

          {error && (
            <div className="border px-4 py-3 rounded-lg mb-4" style={{ backgroundColor: '#2C2C2E', borderColor: '#FF3B30', color: '#FF453A' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 border transition-all"
                style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                placeholder="メールアドレスを入力"
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
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 border transition-all"
                style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                placeholder="パスワードを入力"
                disabled={isLoading}
              />
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border"
              style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* サインアップリンク */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              アカウントをお持ちでない方は{' '}
              <Link
                href="/auth/signup"
                className="text-white hover:opacity-70 font-semibold transition-opacity"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>

        {/* 戻るリンク */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
