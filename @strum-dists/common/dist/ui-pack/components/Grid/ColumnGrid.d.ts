declare type Props = {
    className?: string;
    children?: any;
    onClick?: (e: any) => void;
    fit?: boolean;
    width?: string;
    fontStyle?: string;
    right?: boolean;
    parentSpace?: number;
    start?: boolean;
    center?: boolean;
    end?: boolean;
    text?: boolean;
};
declare function ColumnGrid(props: Props): JSX.Element;
export default ColumnGrid;
