declare type DrawableState = {
    visible: boolean;
    drawed: boolean;
};
declare type SimpleFunc = () => void;
export declare function useDrawablePanel(): [DrawableState, SimpleFunc, SimpleFunc, SimpleFunc];
export {};
