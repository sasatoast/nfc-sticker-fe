# NFC Sticker - フロントエンド

NFCステッカーを使った音楽共有アプリのフロントエンド

## 概要

このアプリケーションは、NFCステッカーをスキャンだけでお気に入りの音楽を友達と簡単に共有できるサービスです。

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org) 15.5.4 (App Router)
- **言語**: TypeScript 5
- **UIフレームワーク**: React 19.1.0
- **スタイリング**: Tailwind CSS 4
- **ビルドツール**: Turbopack
- **開発ポート**: 3001

## 主要機能

### 🎵 音楽共有機能
- NFCステッカーから楽曲情報を読み取り
- 楽曲の詳細情報表示（タイトル、アーティスト、アルバムアート）
- パスワード保護による限定共有

### 🎧 音楽プレイヤー
- HTML5 Audioによる楽曲再生
- 再生コントロール（再生/一時停止、シークバー、音量調整）
- レスポンシブデザイン対応

### 🔗 ストリーミングサービス連携
- Spotify連携
- Apple Music連携
- ワンクリックで各サービスへ遷移

### 👤 ユーザー認証
- サインアップ機能
- ログイン/ログアウト機能
- JWT認証による安全な通信

### 📊 ランキング機能
- 人気楽曲のランキング表示
- 共有回数のカウント
- アーティスト別の楽曲表示

### 🎨 UI/UX
- ダークテーマのモダンなデザイン
- スムーズなアニメーション
- モバイルファーストなレスポンシブデザイン
- フッターナビゲーション

## セットアップ

### 前提条件

- Node.js 20以上
- npm / yarn / pnpm / bun

### インストール

```bash
# 依存パッケージのインストール
npm install
```

### 環境変数

プロジェクトルートに `.env.local` ファイルを作成し、バックエンドのURLを設定してください：

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動（Turbopack使用）
npm run dev
```

ブラウザで [http://localhost:3001](http://localhost:3001) を開いてアプリケーションを確認できます。

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルドしたアプリケーションの起動
npm start
```

## ディレクトリ構成

```
nfc-sticker-fe/
├── app/                      # Next.js App Router
│   ├── auth/                # 認証関連ページ
│   │   ├── login/          # ログインページ
│   │   └── signup/         # サインアップページ
│   ├── home/               # ホームページ
│   ├── player/[id]/        # 音楽プレイヤーページ
│   ├── share/[id]/         # 楽曲共有ページ
│   │   └── unlock/         # パスワード保護解除
│   ├── artist/[id]/        # アーティスト詳細ページ
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # ランディングページ
├── components/              # 再利用可能なコンポーネント
│   ├── AppleMusicButton.tsx
│   ├── AudioPlayer.tsx
│   ├── FooterNavigation.tsx
│   ├── RankingCard.tsx
│   ├── SongCard.tsx
│   └── SpotifyButton.tsx
├── contexts/                # React Context
│   └── AuthContext.tsx     # 認証コンテキスト
├── lib/                     # ユーティリティ関数
│   └── api.ts              # API通信ライブラリ
└── public/                  # 静的ファイル
```

## コンポーネント一覧

### コアコンポーネント

- **`AudioPlayer`**: 音楽再生用のカスタムプレイヤー
- **`SongCard`**: 楽曲情報を表示するカード
- **`RankingCard`**: ランキング表示用のカード
- **`FooterNavigation`**: 下部固定ナビゲーション
- **`SpotifyButton`**: Spotify連携ボタン
- **`AppleMusicButton`**: Apple Music連携ボタン

## API連携

バックエンドAPIとの通信は `lib/api.ts` を通じて行います。

```typescript
// 使用例
import api from '@/lib/api';

// 楽曲情報の取得
const song = await api.get(`/songs/${id}`);

// ユーザー登録
const user = await api.post('/auth/signup', { username, password });
```

## デザインガイドライン

詳細なデザインガイドラインは [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md) を参照してください。

### カラーパレット

- **背景色**: `#1C1C1E`
- **カード背景**: `#242424`
- **カード情報エリア**: `#2C2C2E`
- **ボーダー**: `#3A3A3C`
- **メインテキスト**: `#FFFFFF`
- **セカンダリテキスト**: `#C7C7CC`

## ページ構成

| パス | 説明 |
|------|------|
| `/` | ランディングページ |
| `/home` | ホームページ（ランキング表示） |
| `/auth/login` | ログインページ |
| `/auth/signup` | サインアップページ |
| `/player/[id]` | 音楽プレイヤーページ |
| `/share/[id]` | 楽曲共有ページ |
| `/share/unlock` | パスワード解除ページ |
| `/artist/[id]` | アーティスト詳細ページ |

## 開発のヒント

### ホットリロード

`app/page.tsx` を編集すると、ページが自動的に更新されます。

### フォント最適化

このプロジェクトは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用して、Vercelの [Geist](https://vercel.com/font) フォントを自動的に最適化しています。

### 認証状態の管理

`AuthContext` を使用して、アプリケーション全体で認証状態を管理しています。

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  // ...
}
```

## トラブルシューティング

### ポート3001が使用中の場合

```bash
# 別のポートで起動
npm run dev -- --port 3002
```

### ビルドエラーが発生する場合

```bash
# node_modulesとキャッシュをクリア
rm -rf node_modules .next
npm install
npm run dev
```


