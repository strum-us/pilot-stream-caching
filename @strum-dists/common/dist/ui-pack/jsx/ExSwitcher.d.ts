import { ReactElement } from 'react';
declare type Props = {
    className?: string;
    children: any[];
    current: string;
};
export declare function Switcher(props: Props): any;
declare type ItemProps = {
    children: ReactElement | ReactElement[];
    case: string;
};
export declare function SwitcherCase(props: ItemProps): JSX.Element;
export {};
