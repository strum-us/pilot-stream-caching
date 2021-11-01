declare type Props = {
    children?: any;
    onClick?: (e: any) => void;
    title?: string;
    type?: 'primary' | 'secondary' | 'warn';
    width?: number;
    disabled?: boolean;
    className?: string;
};
export declare const SimpleButton: (props: Props) => JSX.Element;
export {};
