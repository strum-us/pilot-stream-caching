import React from 'react';
export declare type MenuPosition = {
    x: number;
    y: number;
};
declare type MenuItemProps = {
    className?: string;
    children: React.ReactNode;
    onClick?: (e?: any) => void;
    checked?: boolean;
};
export declare function MenuItem(props: MenuItemProps): JSX.Element;
declare type MenuLabelProps = {
    children: string;
};
export declare function MenuLabel(props: MenuLabelProps): JSX.Element;
export declare function MenuDivider(): JSX.Element;
export {};
