declare class ImageClipboard {
    private imageData;
    setImageData(imageData: string | ArrayBuffer | null): void;
    getImageData(): string;
}
declare type ClipboardItem = {
    type: string;
    id: number;
};
declare class ItemClipboard {
    private items;
    setItems(items: ClipboardItem[]): void;
    getItems(): ClipboardItem[];
}
export declare const imageClipboard: ImageClipboard;
export declare const itemClipboard: ItemClipboard;
export {};
