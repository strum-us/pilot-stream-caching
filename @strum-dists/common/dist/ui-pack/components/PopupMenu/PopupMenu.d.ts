import React from 'react';
declare type MenuProps = {
    children: React.ReactNode;
    targetRect: DOMRect | null;
    setClose: (e?: any) => void;
};
export declare function PopupMenu(props: MenuProps): JSX.Element;
export declare function usePopupMenu(): [DOMRect | null, () => void, (e: any) => void];
export {};
