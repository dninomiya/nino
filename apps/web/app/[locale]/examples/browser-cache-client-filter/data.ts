import { getCachedData } from "./cache";
import { Todo } from "./type";

export const getTodos = async () => {
  const cacheName = "todos";
  const url = "https://jsonplaceholder.typicode.com/todos";

  const cachedData = await getCachedData<Todo[]>(cacheName, url);

  if (cachedData) {
    return cachedData;
  }

  const cacheStorage = await caches.open(cacheName);
  await cacheStorage.add(url);
  return (await getCachedData<Todo[]>(cacheName, url)) || null;
};
