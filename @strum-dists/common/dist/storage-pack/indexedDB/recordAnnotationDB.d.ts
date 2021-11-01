import { RecordEventType } from './recordEventDB';
export declare const RecordAnnotationDB: {
    getStore(): IDBObjectStore;
    write(value: RecordEventType): void;
    read(id: string): any;
    clear(): void;
    getAll(): IDBRequest<any[]>;
    getAllData(): Promise<RecordEventType[]>;
};
