export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  return await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
};
