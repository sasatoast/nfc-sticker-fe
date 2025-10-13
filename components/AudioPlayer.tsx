'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import SpotifyButton from './SpotifyButton';
import AppleMusicButton from './AppleMusicButton';

interface AudioPlayerProps {
  audioUrl: string;
  songName: string;
  artistName: string;
  albumArtUrl: string;
  spotifyUrl?: string;
  appleUrl?: string;
  artistId?: number;
}

export default function AudioPlayer({
  audioUrl,
  songName,
  artistName,
  albumArtUrl,
  spotifyUrl,
  appleUrl,
  artistId,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 再生/一時停止
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 時間更新
  const handleTimeUpdate = () => {
    if (!audioRef.current || isDragging) return;
    const newTime = audioRef.current.currentTime;
    const currentDuration = audioRef.current.duration;
    
    // durationが正しく設定されていない場合は更新
    if (isFinite(currentDuration) && currentDuration > 0 && duration === 0) {
      setDuration(currentDuration);
      console.log('Duration updated from timeUpdate:', currentDuration);
    }
    
    // currentTimeがdurationを超えないように制限
    const clampedTime = Math.min(newTime, currentDuration || 0);
    setCurrentTime(clampedTime);
    console.log('Time update:', clampedTime, 'Duration:', duration, 'Audio Duration:', currentDuration, 'IsDragging:', isDragging);
  };

  // メタデータ読み込み
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const newDuration = audioRef.current.duration;
    console.log('Loaded metadata - Duration:', newDuration, 'isNaN:', isNaN(newDuration), 'isFinite:', isFinite(newDuration));
    if (isFinite(newDuration) && newDuration > 0) {
      setDuration(newDuration);
      console.log('Duration set to:', newDuration);
    }
  };

  // 再生可能になった時
  const handleCanPlay = () => {
    if (!audioRef.current) return;
    const newDuration = audioRef.current.duration;
    console.log('Can play - Duration:', newDuration);
    if (isFinite(newDuration) && newDuration > 0 && duration === 0) {
      setDuration(newDuration);
      console.log('Duration set from canPlay:', newDuration);
    }
  };

  // シーク開始
  const handleSeekStart = () => {
    setIsDragging(true);
  };

  // シーク中
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    const maxTime = audioRef.current.duration || duration;
    const clampedTime = Math.min(time, maxTime);
    setCurrentTime(clampedTime);
  };

  // シーク終了（マウス）
  const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat((e.target as HTMLInputElement).value);
    const maxTime = audioRef.current.duration || duration;
    const clampedTime = Math.min(time, maxTime);
    console.log('Seeking to:', clampedTime, 'Duration:', duration, 'MaxTime:', maxTime);
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    setIsDragging(false);
  };

  // シーク終了（タッチ）
  const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat((e.target as HTMLInputElement).value);
    const maxTime = audioRef.current.duration || duration;
    const clampedTime = Math.min(time, maxTime);
    console.log('Seeking to:', clampedTime, 'Duration:', duration, 'MaxTime:', maxTime);
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    setIsDragging(false);
  };

  // 時間フォーマット（秒 → MM:SS）
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 再生終了時
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // durationの変更を監視
  useEffect(() => {
    console.log('Duration state changed to:', duration);
  }, [duration]);

  // プログレス値の計算
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full min-h-screen bg-gray-900 flex flex-col">
      {/* 背景画像（ぼかし効果付き） */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${albumArtUrl})`,
            filter: 'blur(20px) brightness(0.3)',
          }}
        />
      </div>

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* メインコンテンツ */}
      <div className="relative z-20 flex flex-col h-screen">
        {/* 上部スペース */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pt-16 pb-4">
          {/* アルバムアート */}
          <div className="w-64 h-64 max-w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-6 border-4 border-white/20">
            <img
              src={albumArtUrl}
              alt={`${songName} - ${artistName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 画像読み込みエラー時のフォールバック
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNjAgMTIwQzE3MC40MTEgMTIwIDE4MCAxMjkuNTg5IDE4MCAxNDBDMTgwIDE1MC40MTEgMTcwLjQxMSAxNjAgMTYwIDE2MEMxNDkuNTg5IDE2MCAxNDAgMTUwLjQxMSAxNDAgMTQwQzE0MCAxMjkuNTg5IDE0OS41ODkgMTIwIDE2MCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNDAgMTYwSDkwVjIwMEgxNDBWMjMwSDkwVjI3MEgxNDBWMzAwSDE2MEwyMzAgMjAwTDE2MCAxMDBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
          </div>

          {/* 楽曲名とアーティスト名 */}
          <div className="text-center px-4 mb-4">
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg break-words line-clamp-2">
              {songName}
            </h1>
            {artistId ? (
              <Link
                href={`/artist/${artistId}`}
                className="text-lg text-gray-300 hover:text-white drop-shadow-md transition-colors cursor-pointer"
              >
                {artistName}
              </Link>
            ) : (
              <p className="text-lg text-gray-300 drop-shadow-md">
                {artistName}
              </p>
            )}
          </div>
        </div>

        {/* 下部のプレイヤーコントロール */}
        <div className="bg-black/90 backdrop-blur-sm px-6 pb-20 pt-4">
            {/* プログレスバー */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max={duration || 1}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeekChange}
                onMouseDown={handleSeekStart}
                onMouseUp={handleMouseUp}
                onTouchStart={handleSeekStart}
                onTouchEnd={handleTouchEnd}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                disabled={duration === 0}
              />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

            {/* 再生ボタンとサブスクリプションリンク */}
            <div className="flex items-center justify-center gap-6">
              {/* Spotify ボタン */}
              {spotifyUrl && (
                <div className="flex-1 max-w-32">
                  <SpotifyButton url={spotifyUrl} />
                </div>
              )}

              {/* 再生ボタン（中央） */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-200 shadow-lg active:scale-95 flex-shrink-0 z-20"
                aria-label={isPlaying ? '一時停止' : '再生'}
              >
                {isPlaying ? (
                  // 一時停止アイコン
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  // 再生アイコン
                  <svg
                    className="w-7 h-7 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Apple Music ボタン */}
              {appleUrl && (
                <div className="flex-1 max-w-32">
                  <AppleMusicButton url={appleUrl} />
                </div>
              )}
            </div>
        </div>
      </div>

      {/* HTML5 Audio要素 */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        preload="metadata"
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

