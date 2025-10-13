import { notFound } from 'next/navigation';
import { getPlayerSong } from '@/lib/api';
import AudioPlayer from '@/components/AudioPlayer';
import Link from 'next/link';

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;

  let songData;
  try {
    songData = await getPlayerSong(id);
  } catch (error) {
    console.error('Failed to fetch song:', error);
    notFound();
  }

  const song = songData;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 戻るボタン（フローティング） */}
      <Link
        href="/"
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
      </Link>

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

