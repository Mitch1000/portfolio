import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const { useFrame, useStore, useThree } = window.ReactFiber;
const { forwardRef, useEffect, useMemo, useRef } = window.React;
import { ParentProvider } from './context.js';
import { AddHandlers, usePropertySignals } from './utils.js';
import { DEFAULT_PIXEL_SIZE, readReactive, reversePainterSortStable, createRootState, setupRoot, } from '@pmndrs/uikit/internals';
import { useComponentInternals } from './ref.js';
import { computed, signal } from '@preact/signals-core';
import { DefaultProperties } from './default.js';
export const Root = forwardRef((properties, ref) => {
    const renderer = useThree((state) => state.gl);
    renderer.setTransparentSort(reversePainterSortStable);
    const store = useStore();
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const pixelSizeSignal = useMemo(() => signal(undefined), []);
    pixelSizeSignal.value = properties.pixelSize;
    const propertySignals = usePropertySignals(properties);
    const onFrameSet = useMemo(() => new Set(), []);
    const whileOnFrameRef = useRef(false);
    const invalidate = useThree((s) => s.invalidate);
    const internals = useMemo(() => createRootState(outerRef, computed(() => readReactive(pixelSizeSignal.value) ?? DEFAULT_PIXEL_SIZE), propertySignals.style, propertySignals.properties, propertySignals.default, () => store.getState().camera, renderer, onFrameSet, () => {
        if (whileOnFrameRef.current) {
            //request render unnecassary -> already rendering
            return;
        }
        //not rendering -> requesting a new frame
        invalidate();
    }, 
    //requestFrame = invalidate, because invalidate always causes another frame
    invalidate), [invalidate, onFrameSet, pixelSizeSignal, propertySignals, renderer, store]);
    internals.interactionPanel.name = properties.name ?? '';
    useEffect(() => {
        if (outerRef.current == null || innerRef.current == null) {
            return;
        }
        const abortController = new AbortController();
        setupRoot(internals, propertySignals.style, propertySignals.properties, outerRef.current, innerRef.current, abortController.signal);
        return () => abortController.abort();
    }, [propertySignals, internals]);
    useFrame((_, delta) => {
        whileOnFrameRef.current = true;
        for (const onFrame of onFrameSet) {
            //delta must be provided in milliseconds, therefore multiply by 1000
            onFrame(delta * 1000);
        }
        whileOnFrameRef.current = false;
    });
    useComponentInternals(ref, internals.root, propertySignals.style, internals, internals.interactionPanel);
    return (_jsxs(AddHandlers, { handlers: internals.handlers, ref: outerRef, children: [_jsx("primitive", { object: internals.interactionPanel }), _jsx("object3D", { matrixAutoUpdate: false, ref: innerRef, children: _jsx(DefaultProperties, { ...internals.defaultProperties, children: _jsx(ParentProvider, { value: internals, children: properties.children }) }) })] }));
});
