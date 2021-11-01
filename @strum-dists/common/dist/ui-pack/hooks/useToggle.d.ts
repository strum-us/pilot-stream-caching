declare type SelectorGroupPropsType = {
    groupId: string;
    initial?: any;
};
declare type SelectorGroupProps = {
    children: any;
    className?: any;
    groups: SelectorGroupPropsType[];
};
export declare function ToggleGroup(props: SelectorGroupProps): JSX.Element;
export declare function useToggle(groupId: string): [boolean, (val: boolean) => void];
export declare const toggleGroupList: {
    groupId: string;
    initial: boolean;
}[];
export {};
