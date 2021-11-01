declare type Props = {
    className?: string;
    fix?: boolean;
    center?: boolean;
    children?: any;
    onClick?: (e: any) => void;
    fontStyle?: string;
    small?: boolean;
    normal?: boolean;
    large?: boolean;
};
declare function BasicGrid(props: Props): JSX.Element;
export default BasicGrid;
