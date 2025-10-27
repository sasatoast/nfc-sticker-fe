import { SharedArtist } from '@/lib/api';
import ArtistCircle from './ArtistCircle';

interface ArtistStoryListProps {
  artists: SharedArtist[];
}

export default function ArtistStoryList({ artists }: ArtistStoryListProps) {
  if (artists.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      {/* セクションタイトル */}
      <h2 className="text-lg font-semibold text-white mb-4 px-4">
        共有されたアーティスト
      </h2>

      {/* 横スクロールコンテナ */}
      <div
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          WebkitOverflowScrolling: 'touch', // iOS
        }}
      >
        <div className="flex space-x-4 px-4 py-2">
          {artists.map((artist) => (
            <ArtistCircle key={artist.artist_id} artist={artist} />
          ))}
        </div>
      </div>

      {/* カスタムスタイル（スクロールバーを隠す） */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
