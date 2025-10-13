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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">NFC Sticker</h1>
          <p className="text-blue-600">音楽を共有しよう</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
            ログイン
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="メールアドレスを入力"
                disabled={isLoading}
              />
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-2">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="パスワードを入力"
                disabled={isLoading}
              />
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* サインアップリンク */}
          <div className="mt-6 text-center">
            <p className="text-blue-600">
              アカウントをお持ちでない方は{' '}
              <Link
                href="/auth/signup"
                className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
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
            className="text-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
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
