export interface FetchOptions extends RequestInit {
  body?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { body, ...customConfig } = options;
  const headers: HeadersInit = {
    ...customConfig.headers,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
      // Do NOT set Content-Type header for FormData, browser will do it with boundary
    } else {
      config.body = JSON.stringify(body);
      (headers as any)['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(url, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data: any;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        typeof data === 'string' ? data : (data.error || data.message || 'API request failed'),
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle cases where response.json() might fail if the response is not valid JSON
    if (error instanceof SyntaxError) {
        throw new ApiError('Failed to parse JSON response from server.', 500, { error: 'Invalid JSON' });
    }
    throw new Error(error instanceof Error ? error.message : 'Network error occurred');
  }
}
