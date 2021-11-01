declare type Props = {
    placeHolder?: string;
    width: string;
    height?: 'small' | 'normal' | 'large';
    onChange?: (e: any) => void;
    onClose?: (e: any) => void;
    onKeyPress?: (e: any) => void;
    close?: boolean;
    type: 'box' | 'under' | 'none';
    icon?: any;
    value?: string;
    password?: boolean;
    autoFocus?: boolean;
    className?: string;
    timer?: boolean;
    readonly?: boolean;
};
export default function InputComponent(props: Props): JSX.Element;
export {};
