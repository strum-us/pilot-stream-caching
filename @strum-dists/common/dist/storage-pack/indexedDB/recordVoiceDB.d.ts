export declare const RecordVoiceDB: {
    getStore(): IDBObjectStore;
    getIndex(indexName: string): any;
    write(value: any): void;
    read(id: string): any;
    readByKeyIndex(key: string): any;
    clear(): void;
    getAll(): IDBRequest<any[]>;
    getAllData(): Promise<any>;
};
