import Link from 'next/link';
import { ReceivedSongItem, UserSongItem } from '@/lib/api';

interface SongCardProps {
  song: ReceivedSongItem | UserSongItem;
  onClick?: () => void;
}

export default function SongCard({ song, onClick }: SongCardProps) {
  // onClickが指定されている場合は、Linkではなくdivを使用
  if (onClick) {
    return (
      <div
        onClick={onClick}
        className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group cursor-pointer border font-sans"
        style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
      >
        <SongCardContent song={song} />
      </div>
    );
  }

  return (
    <Link
      href={`/player/${song.song_id}`}
      className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group cursor-pointer border font-sans"
      style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
    >
      <SongCardContent song={song} />
    </Link>
  );
}

// 共通の楽曲カードコンテンツ
function SongCardContent({ song }: { song: ReceivedSongItem | UserSongItem }) {
  return (
    <>
      {/* 楽曲画像エリア */}
      <div
        style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}
      >
        <img
          src={song.song_picture_url}
          alt={song.song_name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* 再生ボタン */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <svg
            style={{
              width: '24px',
              height: '24px',
              color: '#1a1a1a',
              marginLeft: '3px',
            }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* 楽曲情報エリア */}
      <div
        className="p-3 space-y-1 border-t"
        style={{ backgroundColor: '#2C2C2E', borderTopColor: '#3A3A3C' }}
      >
        <h3 className="font-bold text-white text-base leading-tight line-clamp-2">
          {song.song_name}
        </h3>
        <p className="text-xs text-gray-300 line-clamp-1">{song.artist_name}</p>
      </div>
    </>
  );
}
