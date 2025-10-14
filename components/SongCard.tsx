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
      <div className="relative aspect-square">
        <img
          src={song.song_picture_url}
          alt={song.song_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* 楽曲情報エリア */}
      <div className="p-3 space-y-1 border-t" style={{ backgroundColor: '#2C2C2E', borderTopColor: '#3A3A3C' }}>
        <h3 className="font-bold text-white text-base leading-tight line-clamp-2">
          {song.song_name}
        </h3>
        <p className="text-xs text-gray-300 line-clamp-1">
          {song.artist_name}
        </p>
      </div>
    </>
  );
}
