import React from 'react';
declare type MenuPosition = {
    x: number;
    y: number;
};
declare type MenuProps = {
    children: React.ReactNode;
    targetPos: MenuPosition | null;
    setClose: () => void;
};
export declare function PopupContextMenu(props: MenuProps): JSX.Element;
declare type Option = {
    close?: () => void;
};
export declare function usePopupContextMenu(options?: Option): [MenuPosition | null, () => void, (e: any, pos?: MenuPosition) => void];
export {};
