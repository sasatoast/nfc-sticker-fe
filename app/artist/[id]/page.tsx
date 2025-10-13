'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getArtist, getArtistRanking, Artist, RankingItem } from '@/lib/api';
import RankingCard from '@/components/RankingCard';
import FooterNavigation from '@/components/FooterNavigation';
import SpotifyButton from '@/components/SpotifyButton';
import AppleMusicButton from '@/components/AppleMusicButton';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchArtistData = async () => {
      try {
        setIsLoading(true);
        const [artistData, rankingData] = await Promise.all([
          getArtist(id),
          getArtistRanking(id)
        ]);
        
        setArtist(artistData);
        setRankings(rankingData.data);
      } catch (error) {
        console.error('Failed to fetch artist data:', error);
        setError('アーティスト情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">{error || 'アーティストが見つかりませんでした'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#1C1C1E' }}>
      {/* ヘッダー */}
      <header style={{ backgroundColor: '#1C1C1E', borderBottomColor: '#3A3A3C' }} className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              戻る
            </button>
            <h1 className="text-xl font-bold text-white">{artist.name}</h1>
            <div className="w-16"></div> {/* スペーサー */}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* アーティスト情報セクション */}
          <div className="rounded-xl shadow-md p-6 mb-8 border" style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}>
            <div className="text-center">
              {/* アーティスト画像 */}
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-red-500">
                <img
                  src={artist.picture_url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-6">
                {artist.name}
              </h2>
              
              {/* サブスクリプションリンク */}
              <div className="flex justify-center gap-4 mb-4">
                {artist.spotify_url && (
                  <SpotifyButton url={artist.spotify_url} />
                )}
                {artist.apple_url && (
                  <AppleMusicButton url={artist.apple_url} />
                )}
              </div>

              {/* ホームページリンク */}
              {artist.homepage_url && (
                <a
                  href={artist.homepage_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  公式サイト
                </a>
              )}
            </div>
          </div>

          {/* ランキングセクション */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              人気楽曲ランキング
            </h3>

            {rankings.length === 0 ? (
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
                    d="M9 19v6l3-3 3 3v-6m-9 0V5l3-3 3 3v11"
                  />
                </svg>
                <p className="text-white text-lg">まだランキングデータがありません</p>
                <p className="text-gray-400 text-sm mt-2">
                  楽曲が共有されるとランキングに表示されます
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {rankings.map((ranking, index) => (
                  <RankingCard
                    key={`${ranking.user_name}-${ranking.song_name}`}
                    ranking={ranking}
                    rank={index + 1}
                  />
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
