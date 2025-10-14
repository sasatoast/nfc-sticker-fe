'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface FooterNavigationProps {
  className?: string;
}

export default function FooterNavigation({ className = '' }: FooterNavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <footer className={`fixed bottom-0 left-0 right-0 border-t shadow-lg backdrop-blur-md font-sans ${className}`} style={{ backgroundColor: '#1C1C1E', borderTopColor: '#3A3A3C' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 px-8">
          {/* ホームボタン - 左側 */}
          <Link
            href="/home"
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              isActive('/home') ? 'text-white' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs font-medium">ホーム</span>
          </Link>

          {/* 共有ボタン - 右側 */}
          <Link
            href="/share"
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              isActive('/share') ? 'text-white' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
            <span className="text-xs font-medium">共有</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
