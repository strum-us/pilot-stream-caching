import React from 'react';
declare type Props = {
    className?: string;
    children: any;
};
export declare const HoverContext: React.Context<{
    hover: boolean;
}>;
export default function HoverProvider(props: Props): JSX.Element;
export {};
