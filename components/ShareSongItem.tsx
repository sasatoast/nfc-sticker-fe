import { ReceivedSongItem, UserSongItem } from '@/lib/api';

interface ShareSongItemProps {
  song: ReceivedSongItem | UserSongItem;
  onClick?: () => void;
}

export default function ShareSongItem({ song, onClick }: ShareSongItemProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer overflow-hidden border group"
      style={{ backgroundColor: '#242424', borderColor: '#3A3A3C' }}
    >
      <div className="flex items-center p-3 gap-4">
        {/* 楽曲画像 */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden"
          style={{ width: '72px', height: '72px' }}
        >
          <img
            src={song.song_picture_url}
            alt={song.song_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 楽曲情報 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2 mb-1">
            {song.song_name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">
            {song.artist_name}
          </p>
        </div>

        {/* 矢印アイコン */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-white transition-colors duration-200">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* 下部のアクセント */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
}
