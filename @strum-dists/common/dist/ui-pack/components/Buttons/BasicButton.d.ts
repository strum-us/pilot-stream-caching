declare type Props = {
    className?: string;
    width?: number;
    height?: 'small' | 'normal' | 'large' | 'big';
    title?: string;
    children?: any;
    type?: 'primary' | 'secondary' | 'negative' | 'negative-ghost' | 'warn' | 'ghost';
    disabled?: boolean;
    onClick?: (e: any) => void;
    shadow?: boolean;
    right?: boolean;
    center?: boolean;
    round?: boolean;
};
/**
 * 기본 버튼 입니다.
 *
 */
export declare function BasicButton(props: Props): JSX.Element;
export declare namespace BasicButton {
    var defaultProps: {
        disabled: boolean;
        height: string;
    };
}
export {};
