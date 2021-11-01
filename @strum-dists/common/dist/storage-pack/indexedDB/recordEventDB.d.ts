export declare enum ActionEventType {
    boxSelection = "boxSelection",
    cursor = "cursor",
    viewport = "viewport",
    textSelection = "textSelection",
    setAnnotations = "setAnnotations",
    removeAnnotations = "removeAnnotations",
    penDrawing = "penDrawing",
    textOngoing = "textOngoing",
    changeFile = "changeFile",
    penDrawingPoint = "penDrawingPoint"
}
export declare type RecordEventType = {
    type: ActionEventType;
    data: Object;
    fileId: number;
    timeStamp?: number;
};
export declare const RecordEventDB: {
    getStore(): IDBObjectStore;
    write(value: RecordEventType): void;
    read(id: string): any;
    clear(): void;
    getAll(): IDBRequest<any[]>;
    getAllData(): Promise<RecordEventType[]>;
};
