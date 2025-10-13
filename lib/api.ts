/**
 * APIクライアント
 * バックエンドとの通信を抽象化
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * APIリクエストのオプション
 */
interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * 認証トークンを取得
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * 認証トークンを保存
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

/**
 * 認証トークンを削除
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

/**
 * APIリクエストを実行
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = false, headers = {}, ...fetchOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // トークンがある場合は常にヘッダーに追加（認証オプション問わず）
  const token = getAuthToken();
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    console.log('Making API request to:', url, 'with headers:', requestHeaders);
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    console.log('Response status:', response.status, 'for URL:', url);

    // レスポンスヘッダーからAuthorizationトークンを抽出（ログイン/サインアップ時）
    const authHeader = response.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      setAuthToken(token);
    }

    if (!response.ok) {
      // 401エラーの場合は認証エラーとして処理
      if (response.status === 401) {
        removeAuthToken();
        localStorage.removeItem('user');
        const error = new Error('認証が必要です。ログインしてください。');
        (error as any).status = 401;
        throw error;
      }

      // バリデーションエラー（422）の場合は詳細なエラーメッセージを処理
      if (response.status === 422) {
        const errorData = await response.json().catch(() => ({
          message: 'バリデーションエラーが発生しました',
          errors: []
        }));
        
        // エラーメッセージを日本語に変換
        const errorMessages = errorData.errors || [];
        const japaneseMessages = errorMessages.map((msg: string) => {
          if (msg.includes('Email has already been taken')) {
            return 'このメールアドレスは既に使用されています';
          }
          if (msg.includes('Name has already been taken')) {
            return 'このユーザー名は既に使用されています';
          }
          if (msg.includes('Password is too short')) {
            return 'パスワードが短すぎます（最低6文字以上）';
          }
          if (msg.includes("Password confirmation doesn't match")) {
            return 'パスワードが一致しません';
          }
          if (msg.includes('Email is invalid')) {
            return '有効なメールアドレスを入力してください';
          }
          return msg; // その他のエラーはそのまま表示
        });
        
        const error = new Error(japaneseMessages.join('、'));
        (error as any).status = 422;
        (error as any).errors = japaneseMessages;
        throw error;
      }

      const error = await response.json().catch(() => ({
        message: 'エラーが発生しました',
      }));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    // 204 No Contentの場合は空のレスポンスを返す
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error for URL:', url, error);
    
    // ネットワークエラーの場合の詳細な情報を提供
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const networkError = new Error(`ネットワークエラー: ${url} に接続できません。バックエンドサーバーが起動しているか確認してください。`);
      (networkError as any).originalError = error;
      throw networkError;
    }
    
    throw error;
  }
}

/**
 * GETリクエスト
 */
export async function apiGet<T>(
  endpoint: string,
  requireAuth = false
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    requireAuth,
  });
}

/**
 * POSTリクエスト
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  requireAuth = false
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    requireAuth,
  });
}

/**
 * DELETEリクエスト
 */
export async function apiDelete<T>(
  endpoint: string,
  requireAuth = false
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    requireAuth,
  });
}

// =========================
// 認証API
// =========================

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface SignupRequest {
  user: {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
  };
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    share_id: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * ログイン
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/login', {
    user: { email, password },
  });
}

/**
 * サインアップ
 */
export async function signup(
  email: string,
  name: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/signup', {
    user: {
      email,
      name,
      password,
      password_confirmation: passwordConfirmation,
    },
  });
}

/**
 * ログアウト
 */
export async function logout(): Promise<void> {
  await apiDelete('/logout', true);
  removeAuthToken();
}

// =========================
// 楽曲API
// =========================

export interface Song {
  id: number;
  name: string;
  source_url: string;
  picture_url: string;
  spotify_url?: string;
  apple_url?: string;
  artist_name: string;
  artist_id: number;
}

export interface PlayerSongResponse extends Song {}

export interface ReceivedSongItem {
  song_id: number;
  song_name: string;
  song_picture_url: string;
  artist_name: string;
}

export interface ReceivedSongsResponse extends Array<ReceivedSongItem> {}

/**
 * プレイヤー用の楽曲取得（認証不要）
 */
export async function getPlayerSong(id: string, shareId?: string | null): Promise<PlayerSongResponse> {
  const queryParams = shareId ? `?share_id=${encodeURIComponent(shareId)}` : '';
  return apiGet<PlayerSongResponse>(`/player/songs/${id}${queryParams}`);
}

/**
 * 共有された楽曲一覧取得（認証必要）
 */
export async function getReceivedSongs(): Promise<ReceivedSongItem[]> {
  return apiGet<ReceivedSongItem[]>('/users/received/songs', true);
}


/**
 * ログイン状態チェック
 */
export function isLoggedIn(): boolean {
  return !!getAuthToken();
}

