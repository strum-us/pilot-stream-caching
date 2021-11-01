declare type Props = {
    selected?: boolean;
    size?: 'small' | 'normal' | 'large';
    styled?: string;
    children?: any;
    onClick?: (e: any) => void;
    hiddenStyle?: boolean;
};
export default function CheckBox(props: Props): JSX.Element;
export {};
