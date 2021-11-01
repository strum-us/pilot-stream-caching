/// <reference types="react" />
import DraggableContainer from './DraggableContainer';
export default DraggableContainer;
export declare const DragItem: (props: {
    children: any;
    selectedIds: string[];
    onDrop: (dropResult: {
        id: string;
    }, selectedItems: string[]) => void;
    onDragging?: () => void;
}) => import("react").FunctionComponentElement<{
    ref: import("react-dnd").ConnectDragSource;
}>;
export declare const DropItem: (props: {
    droppedId: string;
    onOver?: () => void;
    onOut?: () => void;
    children: any;
}) => import("react").FunctionComponentElement<{
    ref: import("react-dnd").ConnectDropTarget;
}>;
export declare const DragAndDropItem: (props: {
    children: any;
    selectedIds: string[];
    onDrop: (dropResult: {
        id: string;
    }, selectedItems: string[]) => void;
    onDragging?: () => void;
    droppedId: string;
    onOver?: () => void;
    onOut?: () => void;
    length: number;
    isGrid?: boolean;
}) => JSX.Element;
