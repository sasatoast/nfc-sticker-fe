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

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 認証が必要な場合、トークンを追加
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // レスポンスヘッダーからAuthorizationトークンを抽出（ログイン/サインアップ時）
    const authHeader = response.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      setAuthToken(token);
    }

    if (!response.ok) {
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
    console.error('API Request Error:', error);
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
    name: string;
    password: string;
  };
}

export interface SignupRequest {
  user: {
    name: string;
    password: string;
    password_confirmation: string;
  };
}

export interface AuthResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * ログイン
 */
export async function login(
  name: string,
  password: string
): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/login', {
    user: { name, password },
  });
}

/**
 * サインアップ
 */
export async function signup(
  name: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  return apiPost<AuthResponse>('/signup', {
    user: {
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

export interface ReceivedSongsResponse {
  songs: Song[];
}

/**
 * プレイヤー用の楽曲取得（認証不要）
 */
export async function getPlayerSong(id: string): Promise<PlayerSongResponse> {
  return apiGet<PlayerSongResponse>(`/player/songs/${id}`);
}

/**
 * 共有された楽曲一覧取得（認証必要）
 */
export async function getReceivedSongs(): Promise<ReceivedSongsResponse> {
  return apiGet<ReceivedSongsResponse>('/users/received/songs', true);
}

/**
 * ログイン状態チェック
 */
export function isLoggedIn(): boolean {
  return !!getAuthToken();
}

