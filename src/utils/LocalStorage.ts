export class LocalStorage {

  static getItem(key: string) {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(key);
      if (!value) return null;
      return JSON.parse(value);
    }
    return null
 
  }

  static setItem(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}