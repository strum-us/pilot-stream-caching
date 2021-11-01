declare type Props = {
    selected?: boolean;
    size?: 'small' | 'normal' | 'large';
    styled?: string;
    children: string;
    onClick?: (e: any) => void;
    hiddenStyle?: boolean;
};
export default function RadioButton(props: Props): JSX.Element;
export {};
