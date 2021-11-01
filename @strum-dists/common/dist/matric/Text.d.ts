declare type WrapTextInLinesArgs = {
    text: string;
    fontSize: number;
    width: number;
    fontWeight: number;
    fontFamily: string;
};
export declare const wrapTextInLines: (args: WrapTextInLinesArgs) => string[];
export declare const wrapLine: (line: string, width: number, context: CanvasRenderingContext2D) => string[];
export declare const wrapWord: (word: string, width: number, context: CanvasRenderingContext2D) => string[];
export {};
