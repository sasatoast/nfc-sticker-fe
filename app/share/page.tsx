'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSongs, UserSongItem } from '@/lib/api';
import FooterNavigation from '@/components/FooterNavigation';
import SongCard from '@/components/SongCard';
import TipsModal from '@/components/TipsModal';

export default function SharePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [songs, setSongs] = useState<UserSongItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchUserSongs();

    // 初回訪問時にTipsを表示
    const hasSeenTips = localStorage.getItem('hideTipsModal');
    if (!hasSeenTips) {
      setShowTips(true);
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchUserSongs = async () => {
    try {
      setIsLoading(true);
      const response = await getUserSongs();
      setSongs(response);
    } catch (error) {
      console.error('Failed to fetch user songs:', error);
      setError('楽曲の取得に失敗しました');
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewSong = () => {
    router.push('/share/unlock');
  };

  const handleSongClick = (songId: number) => {
    router.push(`/share/${songId}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1C1C1E' }}>
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#1C1C1E' }}>
      {/* Tipsモーダル */}
      {showTips && <TipsModal onClose={() => setShowTips(false)} />}
      
      {/* ヘッダー */}
      <header style={{ backgroundColor: '#1C1C1E', borderBottomColor: '#3A3A3C' }} className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">共有楽曲</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 新しい楽曲を追加するボタン */}
          <button
            onClick={handleAddNewSong}
            className="w-full mb-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-98 border"
            style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>新しい楽曲を追加する</span>
            </div>
          </button>

          {error && (
            <div className="border text-white px-4 py-3 rounded-lg mb-4" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
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
              <p className="text-white text-lg">まだ共有可能な楽曲がありません</p>
              <p className="text-gray-400 text-sm mt-2">
                「新しい楽曲を追加する」ボタンから楽曲を開放しましょう！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {songs && songs.map((song) => (
                <SongCard 
                  key={song.song_id} 
                  song={song} 
                  onClick={() => handleSongClick(song.song_id)}
                />
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

