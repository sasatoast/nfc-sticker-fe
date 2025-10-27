'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  getReceivedSongs,
  ReceivedSongItem,
  getSharedArtists,
  SharedArtist,
} from '@/lib/api';
import FooterNavigation from '@/components/FooterNavigation';
import SongCard from '@/components/SongCard';
import ArtistStoryList from '@/components/ArtistStoryList';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [songs, setSongs] = useState<ReceivedSongItem[]>([]);
  const [artists, setArtists] = useState<SharedArtist[]>([]);
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

    // 認証されている場合は共有された楽曲とアーティストを取得
    fetchReceivedSongs();
    fetchSharedArtists();
  }, [isAuthenticated, authLoading, router]);

  const fetchReceivedSongs = async () => {
    try {
      setIsLoading(true);
      const response = await getReceivedSongs();

      // レスポンスが配列でない場合の処理
      if (Array.isArray(response)) {
        setSongs(response);
      } else if (
        response &&
        response.shared_song_data &&
        Array.isArray(response.shared_song_data)
      ) {
        // バックエンドが { shared_song_data: [...] } の形式で返す場合
        setSongs(response.shared_song_data);
      } else {
        // その他の場合は空配列を設定
        setSongs([]);
      }
    } catch (error) {
      console.error('Failed to fetch received songs:', error);
      setError('楽曲の取得に失敗しました');
      setSongs([]); // エラー時も空配列を設定
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSharedArtists = async () => {
    try {
      const response = await getSharedArtists();
      setArtists(response);
    } catch (error) {
      console.error('Failed to fetch shared artists:', error);
      setArtists([]);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1C1C1E' }}
      >
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: '#1C1C1E' }}
    >
      {/* ヘッダー */}
      <header
        style={{ backgroundColor: '#1C1C1E', borderBottomColor: '#3A3A3C' }}
        className="border-b"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">ホーム</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{user?.name}でログイン中</span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-6xl mx-auto py-8">
          {/* アーティストストーリー（横スクロール） */}
          {artists.length > 0 && (
            <div className="mb-8">
              <ArtistStoryList artists={artists} />
            </div>
          )}

          {/* 共有された楽曲セクション */}
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              共有された楽曲
            </h2>

            {error && (
              <div className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {songs && songs.length === 0 && !error ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-500 mb-4"
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
                <p className="text-white text-lg">
                  まだ共有された楽曲がありません
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  NFCシールをスキャンして楽曲を共有してもらいましょう！
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {songs &&
                  songs.map((song) => (
                    <SongCard key={song.song_id} song={song} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* フッターナビゲーション */}
      <FooterNavigation />
    </div>
  );
}
