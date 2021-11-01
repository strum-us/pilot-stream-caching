declare type Props = {
    holder: string;
    onHandleConfirm: (chips: string[]) => void;
    onHandleChange: (text: string) => void;
    chips: string[];
    addChip: (chip: string) => void;
    deleteChip: (chip: string) => void;
    text: string;
    setText: (text: string) => void;
    onHandlePressButton: (e: any) => void;
    openContactPopup?: (e: any) => void;
};
export default function ChipInputBoxComponent(props: Props): JSX.Element;
export {};
