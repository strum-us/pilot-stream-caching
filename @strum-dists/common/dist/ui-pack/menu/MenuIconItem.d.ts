declare type Props = {
    className?: string;
    useCheck?: boolean;
    checked?: boolean;
    svgIcon?: (any: any) => any;
    image?: any;
    title: string;
    badgeNumber?: string;
    onClick: (e: any) => void;
    width?: number;
    height?: number;
    h?: number;
    inValid?: boolean;
    children?: any;
};
export declare function MenuIconItem(props: Props): JSX.Element;
export {};
