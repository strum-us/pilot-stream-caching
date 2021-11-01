declare type Props = {
    maxWidth?: number;
    changeInput: (text: string) => void;
    text: string;
    white?: boolean;
    hover?: boolean;
};
export declare function EditableInput(props: Props): JSX.Element;
export {};
