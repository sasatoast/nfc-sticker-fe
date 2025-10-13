'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getReceivedSongs, Song } from '@/lib/api';
import FooterNavigation from '@/components/FooterNavigation';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 認証状態の読み込み中は何もしない
    if (authLoading) {
      return;
    }

    // 認証されていない場合はログインページにリダイレクト
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // 認証されている場合は共有された楽曲を取得
    fetchReceivedSongs();
  }, [isAuthenticated, authLoading, router]);

  const fetchReceivedSongs = async () => {
    try {
      setIsLoading(true);
      const response = await getReceivedSongs();
      setSongs(response.songs);
    } catch (error) {
      console.error('Failed to fetch received songs:', error);
      setError('楽曲の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-blue-900 text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-900">ホーム</h1>
            <div className="flex items-center gap-4">
              <span className="text-blue-700">こんにちは、{user?.name}さん</span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            共有された楽曲
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {songs && songs.length === 0 && !error ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-blue-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <p className="text-blue-500 text-lg">まだ共有された楽曲がありません</p>
              <p className="text-blue-400 text-sm mt-2">
                NFCシールをスキャンして楽曲を共有してもらいましょう！
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {songs && songs.map((song) => (
                <Link
                  key={song.id}
                  href={`/player/${song.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group"
                >
                  <div className="relative aspect-square">
                    <img
                      src={song.picture_url}
                      alt={song.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                      <div className="flex items-center gap-2 text-white">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="text-sm font-medium">再生する</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-blue-900 line-clamp-1 mb-1">
                      {song.name}
                    </h3>
                    <p className="text-sm text-blue-600 line-clamp-1">
                      {song.artist_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* フッターナビゲーション */}
      <FooterNavigation />
    </div>
  );
}

