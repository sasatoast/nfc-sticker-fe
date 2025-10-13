import { RankingItem } from '@/lib/api';

interface RankingCardProps {
  ranking: RankingItem;
  rank: number;
}

export default function RankingCard({ ranking, rank }: RankingCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'; // 金
      case 2:
        return 'from-gray-300 to-gray-500'; // 銀
      case 3:
        return 'from-orange-400 to-orange-600'; // 銅
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-800">
      {/* ランク表示エリア */}
      <div className={`bg-gradient-to-r ${getRankColor(rank)} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white text-xl font-bold">
              {getRankIcon(rank)}
            </span>
            <span className="text-white font-semibold">
              {ranking.user_name}
            </span>
          </div>
          <div className="text-white text-right">
            <div className="text-lg font-bold">{ranking.count}回</div>
          </div>
        </div>
      </div>

      {/* 楽曲情報エリア */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={ranking.picture_url}
            alt={ranking.song_name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm line-clamp-1">
              {ranking.song_name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              共有回数: {ranking.count}回
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
