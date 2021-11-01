declare type FullNameType = {
    firstName?: string;
    lastName?: string;
    email?: string;
};
export declare function fullName(props?: FullNameType): string;
export declare const fileExtentionTitle: (fileName: string) => {
    fileName: string;
    format: string;
};
export declare const getBaseName: (filePath: string) => string;
export declare function isSlackFile(url: string): boolean;
export {};
