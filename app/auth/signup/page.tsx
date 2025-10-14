'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login: contextLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // バリデーション
    if (formData.password !== formData.passwordConfirmation) {
      setError('パスワードが一致しません。');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      const response = await signup(formData.email, formData.name, formData.password, formData.passwordConfirmation);
      // 認証レスポンスからユーザー情報を取得してAuthContextに保存
      contextLogin({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      });
      router.push('/home'); // サインアップ後はホーム画面へ
    } catch (err: any) {
      // エラーメッセージを設定（API側で日本語化済み）
      if (err.message) {
        setError(err.message);
      } else {
        setError('サインアップに失敗しました。入力内容を確認してください。');
      }
      console.error('Signup error:', err);
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

        {/* サインアップフォーム */}
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            新規登録
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

            {/* ユーザー名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 border transition-all"
                style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                placeholder="ユーザー名を入力"
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
                placeholder="パスワードを入力（6文字以上）"
                disabled={isLoading}
              />
            </div>

            {/* パスワード確認 */}
            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-white mb-2">
                パスワード確認
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 border transition-all"
                style={{ backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' }}
                placeholder="パスワードを再入力"
                disabled={isLoading}
              />
            </div>

            {/* サインアップボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border"
              style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
            >
              {isLoading ? '登録中...' : '新規登録'}
            </button>
          </form>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              既にアカウントをお持ちの方は{' '}
              <Link
                href="/auth/login"
                className="text-white hover:opacity-70 font-semibold transition-opacity"
              >
                ログイン
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
