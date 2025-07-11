// Auth utility functions for JWT cookie-based authentication

let authCache: { isAuthenticated: boolean; user: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function checkAuthStatus(): Promise<boolean> {
  // Check cache first
  if (authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
    return authCache.isAuthenticated;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      // Update cache
      authCache = {
        isAuthenticated: true,
        user: userData,
        timestamp: Date.now()
      };
      return true;
    } else {
      // Clear cache
      authCache = {
        isAuthenticated: false,
        user: null,
        timestamp: Date.now()
      };
      return false;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    // Clear cache on error
    authCache = {
      isAuthenticated: false,
      user: null,
      timestamp: Date.now()
    };
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/user/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // Clear cache on logout
    authCache = null;
  }
}

export async function getCurrentUser(): Promise<any> {
  // Check cache first
  if (authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
    return authCache.user;
  }

  // If not in cache, checkAuthStatus will fetch and cache the user data
  const isAuthenticated = await checkAuthStatus();
  return isAuthenticated ? authCache?.user : null;
}

// Clear auth cache (useful for testing or forced refresh)
export function clearAuthCache() {
  authCache = null;
}

// Utility function for making authenticated API calls
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  return fetch(fullUrl, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
