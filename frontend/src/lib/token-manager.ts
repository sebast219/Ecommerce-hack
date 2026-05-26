'use client';

/**
 * TokenManager - Singleton para gestión centralizada de tokens
 * Única fuente de verdad para accessToken y refreshToken en localStorage
 */
class TokenManager {
  private static instance: TokenManager;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  hasValidTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

export const tokenManager = TokenManager.getInstance();
