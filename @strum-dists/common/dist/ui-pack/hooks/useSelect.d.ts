declare type GroupProps = {
    initial?: any;
    groupId: string;
};
declare type SelectorGroupProps = {
    children: any;
    className?: any;
    groups: GroupProps[];
    onSelected?: (key: string) => void;
};
export declare function SelectorGroup(props: SelectorGroupProps): JSX.Element;
declare type SimpleFunc = () => void;
export declare function useSelect(key: string, groupId: string): [boolean, SimpleFunc];
export declare function useSelectCurrent(groupId: string): string;
export declare function setSelect(groupId: string, key: string): void;
export declare function releaseSelect(groupId: string): () => void;
export {};
