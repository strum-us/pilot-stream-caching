declare type Props = {
    title: string;
    width: number;
    height: number;
    alert?: string;
    back?: boolean;
    backClick?: (e: any) => void;
    children?: any;
};
export declare const FormGroup: (props: Props) => JSX.Element;
declare type ListInputProps = {
    placeholder: string;
    width: string;
    dataId: string;
    dataList: any;
    onChange: (e: any) => void;
};
export declare const FormListInput: (props: ListInputProps) => JSX.Element;
declare type SubmitButtonProps = {
    title: string;
    onClick: (e: any) => void;
};
export declare const SubmitButton: (props: SubmitButtonProps) => JSX.Element;
export {};
