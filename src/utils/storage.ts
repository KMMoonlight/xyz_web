export function getStorageItem(key: string, defaultValue: string = '') {
   return localStorage.getItem(key) || defaultValue
}

export function setStorageItem(key: string, value: string) {
    localStorage.setItem(key, value)
}
