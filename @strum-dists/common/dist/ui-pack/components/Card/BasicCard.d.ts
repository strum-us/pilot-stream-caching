declare type Props = {
    children?: any;
    onClick?: (e: any) => void;
    smallSpace?: boolean;
    normalSpace?: boolean;
    largeSpace?: boolean;
    border?: boolean;
    fill?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
    start?: boolean;
    center?: boolean;
    end?: boolean;
    fullSize?: boolean;
    background?: string;
    borderStyle?: string;
};
declare function BasicCard(props: Props): JSX.Element;
export default BasicCard;
