'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TipsModalProps {
  onClose: () => void;
}

const TIPS_IMAGES = [
  '/Tips1.png',
  '/Tips2.png',
  '/Tips3.png',
  '/Tips4.png',
  '/Tips5.png',
];

export default function TipsModal({ onClose }: TipsModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // スワイプの最小距離（ピクセル）
  const minSwipeDistance = 50;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideTipsModal', 'true');
    }
    onClose();
  };

  const handleNext = () => {
    if (currentPage < TIPS_IMAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < TIPS_IMAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dontShowAgain]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'rgba(28, 28, 30, 0.85)' }}>
      {/* 閉じるボタン */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-30 text-white text-5xl font-light hover:opacity-70 transition-opacity leading-none drop-shadow-lg"
        aria-label="閉じる"
        style={{ width: '40px', height: '40px' }}
      >
        ×
      </button>

      {/* 画像エリア */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        {/* 前へボタン（左） */}
        {currentPage > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-6 z-20 text-white text-5xl font-light hover:opacity-70 transition-opacity leading-none"
            aria-label="前へ"
            style={{ width: '40px', height: '40px' }}
          >
            ‹
          </button>
        )}

        {/* 画像コンテンツ */}
        <div className="relative w-full h-full max-w-lg rounded-2xl shadow-2xl p-6" style={{ backgroundColor: 'rgba(36, 36, 36, 0.6)' }}>
          {TIPS_IMAGES.map((src, index) => (
            <div 
              key={index} 
              className={`absolute inset-6 transition-opacity duration-300 ${
                index === currentPage ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={src}
                alt={`Tips ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* 次へボタン（右） */}
        {currentPage < TIPS_IMAGES.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 z-20 text-white text-5xl font-light hover:opacity-70 transition-opacity leading-none"
            aria-label="次へ"
            style={{ width: '40px', height: '40px' }}
          >
            ›
          </button>
        )}
      </div>

      {/* 下部コントロール */}
      <div className="pb-safe-bottom pb-8 px-6">
        {/* ページインジケーター */}
        <div className="flex justify-center gap-2 mb-6">
          {TIPS_IMAGES.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all ${
                index === currentPage 
                  ? 'w-10 bg-white' 
                  : 'w-2.5 bg-white bg-opacity-40'
              }`}
            />
          ))}
        </div>

        {/* 今後表示しないチェックボックス */}
        <div className="flex justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-white text-sm">今後このTIPSを表示しない</span>
          </label>
        </div>
      </div>
    </div>
  );
}

