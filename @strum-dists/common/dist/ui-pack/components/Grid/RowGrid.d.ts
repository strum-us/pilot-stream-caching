declare type Props = {
    className?: string;
    fit?: boolean;
    children?: any;
    onClick?: (e: any) => void;
    height?: string;
    start?: boolean;
    center?: boolean;
    end?: boolean;
};
declare function RowGrid(props: Props): JSX.Element;
export default RowGrid;
