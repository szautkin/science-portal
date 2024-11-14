export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  return await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
};
