export function setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
}

export function getLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
}

export function deleteLocalStorage(key: string) {
    localStorage.removeItem(key);
}