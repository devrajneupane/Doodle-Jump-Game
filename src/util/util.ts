export function getLocalStorage(key: string) {
  return JSON.parse(window.localStorage.getItem(key)!);
}

export function setLocalStorage(key: string, value: number) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

