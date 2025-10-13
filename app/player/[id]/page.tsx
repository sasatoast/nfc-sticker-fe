'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPlayerSong } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AudioPlayer from '@/components/AudioPlayer';

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [id, setId] = useState<string | null>(null);
  const [song, setSong] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchSong = async () => {
      try {
        setIsLoading(true);
        const songData = await getPlayerSong(id);
        setSong(songData);
      } catch (error) {
        console.error('Failed to fetch song:', error);
        setError('楽曲の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleBackClick = () => {
    if (isAuthenticated) {
      router.push('/home');
    } else {
      router.push('/');
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">{error || '楽曲が見つかりませんでした'}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 戻るボタン（フローティング） */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 z-30 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all duration-200 shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      {/* メインの音楽プレイヤー */}
      <AudioPlayer
        audioUrl={song.source_url}
        songName={song.name}
        artistName={song.artist_name}
        albumArtUrl={song.picture_url}
        spotifyUrl={song.spotify_url}
        appleUrl={song.apple_url}
      />
    </div>
  );
}

