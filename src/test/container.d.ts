const { ReactNode, RefAttributes } = window.React;
import { R3FEventMap } from './utils.js';
import { ContainerProperties as BaseContainerProperties } from '@pmndrs/uikit/internals';
import { ComponentInternals } from './ref.js';
export type ContainerProperties = {
    name?: string;
    children?: ReactNode;
} & BaseContainerProperties<R3FEventMap>;
export type ContainerRef = ComponentInternals<BaseContainerProperties<R3FEventMap>>;
export declare const Container: (props: ContainerProperties & RefAttributes<ContainerRef>) => ReactNode;
