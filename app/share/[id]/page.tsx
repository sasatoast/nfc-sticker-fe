'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSongForShare, generateShareUrl, SongForShareResponse } from '@/lib/api';

export default function ShareSongPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [song, setSong] = useState<SongForShareResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const songId = params.id as string;

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchSong();
  }, [isAuthenticated, authLoading, router, songId]);

  const fetchSong = async () => {
    try {
      setIsLoading(true);
      const response = await getSongForShare(songId);
      setSong(response);
    } catch (error) {
      console.error('Failed to fetch song:', error);
      setError('楽曲の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!song) return;

    try {
      // バックエンドのAPIを使用してURLを生成（current_userのshare_idを使用）
      const response = await generateShareUrl(songId);
      const shareUrl = response.url;

      // クリップボードにコピー
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // 2秒後にコピー済み表示をリセット
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('URLのコピーに失敗しました');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1C1C1E' }}>
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-30 w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center text-white hover:opacity-70 active:scale-95 transition-all duration-200"
          style={{ backgroundColor: '#242424', borderColor: '#3A3A3C', border: '1px solid' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white text-xl">{error || '楽曲が見つかりません'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#1C1C1E' }}>
      {/* 背景のぼかし効果（楽曲画像） */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          backgroundImage: `url(${song.picture_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 戻るボタン */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-30 w-11 h-11 rounded-full backdrop-blur-sm flex items-center justify-center text-white hover:opacity-70 active:scale-95 transition-all duration-200"
        style={{ backgroundColor: '#242424', borderColor: '#3A3A3C', border: '1px solid' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="w-full max-w-md">
          {/* アルバムアート */}
          <div className="mb-8 relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: '#3A3A3C' }}>
              <img
                src={song.picture_url}
                alt={song.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 楽曲情報 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              {song.name}
            </h1>
            <p className="text-xl text-gray-300">
              {song.artist_name}
            </p>
          </div>

          {/* URL発行ボタン */}
          <button
            onClick={handleCopyUrl}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 border"
            style={{ 
              backgroundColor: copied ? '#34C759' : '#242424',
              borderColor: '#3A3A3C'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>コピーしました！</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>URLをコピーする</span>
                </>
              )}
            </div>
          </button>

          {/* 説明テキスト */}
          <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
            <p className="text-gray-300 text-sm leading-relaxed text-center">
              ステッカーに書き込んでも、SNSで送ってもどちらでも共有できます！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

