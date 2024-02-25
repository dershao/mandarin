export interface SessionManager<T> {

    get(id: string): T | null;

    getAllData(): Record<string, T>;

    delete(id: string): T | null;

    upsert(id: string, object: T): T;
}


export class LocalStorageSessionManager<T> implements SessionManager<T> {

  private localStorageClient: Storage;

  /**
   * Used to determine if read session data matches the format expected by this instance
   * of local storage session manager
   */
  private isSameType: (arg: any) => arg is T;

  constructor(localStorageClient: Storage | undefined, isSameType: (arg: any) => arg is T) {

    const runningInBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (!runningInBrowser) {
      throw new Error('Local storage session manager is only used for web browsers');
    }

    if (localStorageClient) {
      this.localStorageClient = localStorageClient;
    } else {
      this.localStorageClient = localStorage;
    }

    this.isSameType = isSameType;
  }

  get(id: string): T | null {

    const itemToGet = this.localStorageClient.getItem(id);

    if (itemToGet) {

      const itemToGetParsed = JSON.parse(itemToGet);

      if (this.isSameType(itemToGet)) {

        return itemToGetParsed as T;
      }
    }

    console.warn(`No session found with id ${id}`);

    return null;
  }

  getAllData(): Record<string, T> {

    const allData = {} as Record<string, T>;
    const parsedData = JSON.parse(JSON.stringify(localStorage));

    Object.entries(parsedData).forEach(([key, value]) => {
      const parsedValue = JSON.parse(`${value}`);

      if (this.isSameType(parsedValue)) {
        allData[key] = parsedValue as T;
      } else {
        console.warn(`Ignoring data with key ${key}, unparseable data`)
      }
    });

    return allData;
  }

  delete(id: string): T | null {
    const itemToUpdate = this.localStorageClient.getItem(id);

    if (itemToUpdate) {
      this.localStorageClient.removeItem(id);
      return JSON.parse(itemToUpdate);
    }
        
    return null;
  }

  upsert(id: string, object: T): T {
    const item = JSON.stringify(object);
    const itemToUpdate = this.localStorageClient.getItem(id);
    if (itemToUpdate) {
      console.info(`Updating item ${id} with ${JSON.stringify(item)}`);
    } else {
      console.info(`Creating new item ${id}`);
    }

    this.localStorageClient.setItem(id, item);

    return object;
  }
}