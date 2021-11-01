import React from 'react';
declare type DragProps = {
    children: any;
    selectedIds: string[];
    onDrop: (dropResult: DropResult, selectedItems: string[]) => void;
    onDragging?: () => void;
};
declare type DropResult = {
    id: string;
};
export declare const DragItem: (props: DragProps) => React.FunctionComponentElement<{
    ref: import("react-dnd").ConnectDragSource;
}>;
declare type DropProps = {
    droppedId: string;
    onOver?: () => void;
    onOut?: () => void;
    children: any;
};
export declare const DropItem: (props: DropProps) => React.FunctionComponentElement<{
    ref: import("react-dnd").ConnectDropTarget;
}>;
declare type DragAndDropProps = {
    children: any;
    selectedIds: string[];
    onDrop: (dropResult: DropResult, selectedItems: string[]) => void;
    onDragging?: () => void;
    droppedId: string;
    onOver?: () => void;
    onOut?: () => void;
    length: number;
    isGrid?: boolean;
};
export declare const DragAndDropItem: (props: DragAndDropProps) => JSX.Element;
export {};
