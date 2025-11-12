export const getCachedData = async <T>(
  cacheName: string,
  url: string
): Promise<T | false> => {
  const cacheStorage = await caches.open(cacheName);
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    return false;
  }

  return (await cachedResponse.json()) as T;
};

export const deleteOldCaches = async (keyPrefix: string) => {
  const keys = await caches.keys();
  for (const key of keys) {
    const isOurCache = key.startsWith(keyPrefix);
    if (!isOurCache) {
      continue;
    }
    caches.delete(key);
  }
};

export const getCacheVersion = async () => {
  return 1;
};
