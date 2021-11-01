export declare function safeParse<Type>(json: string): Type | null | undefined;
export declare function safeStringify(json: any): string | null;
export declare function safeToString(value: number): string;
export declare function safeExceptExtension(fileId: string): string | null;
export declare function safeArguments(...args: any[]): any[];
export declare function safePush<T>(array: T[], item: T, key: string): void;
