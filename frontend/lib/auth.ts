// Auth utility functions for JWT cookie-based authentication

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
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
  }
}

export async function getCurrentUser(): Promise<any> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user failed:', error);
    return null;
  }
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
