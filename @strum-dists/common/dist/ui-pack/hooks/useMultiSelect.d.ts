declare type GroupProps = {
    initial?: any;
    groupId: string;
};
declare type SelectorGroupProps = {
    children: any;
    className?: any;
    groups: GroupProps[];
};
export declare function MultiSelectorGroup(props: SelectorGroupProps): JSX.Element;
declare type MultiSetFunc = (key: string[]) => void;
export declare function useMultiSelect(groupId: string): [string[], MultiSetFunc];
export {};
