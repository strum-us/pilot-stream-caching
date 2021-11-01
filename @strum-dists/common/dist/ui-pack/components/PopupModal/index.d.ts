import React from 'react';
import { StringKeyCodes } from '../../../string-pack';
declare type ModalProps = {
    children: React.ReactNode;
    opened: boolean;
    disableOutsideClose?: boolean;
    disableEscClose?: boolean;
    setClose: () => void;
};
declare type ContextType = {
    modalRef: React.RefObject<HTMLDivElement>;
    setKeyEvent: (code: StringKeyCodes, func: Function) => void;
};
export declare function useModalContext(): ContextType;
export declare function PopupModal(props: ModalProps): JSX.Element;
export declare function usePopupModal(): [boolean, () => void, () => void];
export {};
