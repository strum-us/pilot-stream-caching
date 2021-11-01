declare const clearStorage: () => void, safeWriteJson: <Type>(key: string, value: Type) => void | Promise<never>, safeReadJson: <Type>(key: string) => Type, safeDeleteJson: (key: string) => any;
export { clearStorage, safeWriteJson, safeReadJson, safeDeleteJson, };
