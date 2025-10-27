import Link from 'next/link';
import { SharedArtist } from '@/lib/api';

interface ArtistCircleProps {
  artist: SharedArtist;
}

export default function ArtistCircle({ artist }: ArtistCircleProps) {
  return (
    <Link
      href={`/artist/${artist.artist_id}`}
      className="flex flex-col items-center space-y-2 flex-shrink-0"
      style={{ width: '80px' }}
    >
      {/* アーティスト写真（円形） */}
      <div className="relative">
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: '68px',
            height: '68px',
          }}
        >
          <img
            src={artist.artist_picture_url}
            alt={artist.artist_name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* アーティスト名 */}
      <p
        className="text-xs text-center line-clamp-2 text-white w-full px-1"
        style={{
          fontSize: '11px',
          lineHeight: '1.2',
          height: '26px',
          overflow: 'hidden',
        }}
      >
        {artist.artist_name}
      </p>
    </Link>
  );
}
