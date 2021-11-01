import { RecordEventType } from '.';
export declare const RecordOngoingDB: {
    getStore(): IDBObjectStore;
    write(value: RecordEventType): void;
    read(id: string): any;
    clear(): void;
    getAll(): IDBRequest<any[]>;
    getAllData(): Promise<RecordEventType[]>;
};
