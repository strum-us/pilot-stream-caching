declare type SelectorGroupProps = {
    children: any;
    className?: any;
    visible: boolean;
    setVisible: (boolean: any) => void;
};
export declare function VisibleProvider(props: SelectorGroupProps): JSX.Element;
export declare function useVisibleProvider(Visibled: boolean): [boolean, (value: boolean) => void];
export declare function useVisible(): boolean;
export declare function useSetVisible(): (boolean: any) => void;
export {};
