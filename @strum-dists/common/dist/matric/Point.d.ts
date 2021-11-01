export declare class Size {
    width: number;
    height: number;
}
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    subtract(point: Point): Point;
    add(point: Point): Point;
    multiplyPoint(point: Point): Point;
    multiply(ratio: number): Point;
    divide(ratio: number): Point;
    isNaN(): boolean;
    testExpected(title: string, x: number, y: number): void;
    get length(): number;
    clone(): Point;
    norm(): number;
    normalize(): void;
    normalized(): Point;
}
export declare class Vec2 extends Point {
}
export declare const distancePointToPoint: (p1: Point, p2: Point) => number;
