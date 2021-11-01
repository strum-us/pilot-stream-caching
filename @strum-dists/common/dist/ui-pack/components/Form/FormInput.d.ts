declare type InputProps = {
    type?: any;
    placeholder?: string;
    height?: 'small' | 'normal' | 'large';
    error?: string;
    onChange?: (e: any) => void;
    onClose?: (e: any) => void;
    close?: boolean;
    icon?: any;
    value?: string;
    password?: boolean;
    onKeyPress?: (e: any) => void;
    onKeyDown?: (e: any) => void;
    autoFocus?: boolean;
    timer?: boolean;
    readonly?: boolean;
};
export declare const FormInput: (props: InputProps) => JSX.Element;
export {};
