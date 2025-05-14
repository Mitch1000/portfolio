const React = window.React;
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const { forwardRef, useEffect, useMemo, useRef } = window.React;
import { ParentProvider, useParent } from './context.js';
import { AddHandlers, usePropertySignals } from './utils.js';
import { createContainerState, setupContainer, } from '@pmndrs/uikit/internals';
import { useComponentInternals } from './ref.js';
import { DefaultProperties } from './default.js';
export const Container = forwardRef((properties, ref) => {
    const parent = useParent();
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const propertySignals = usePropertySignals(properties);
    const internals = useMemo(() => createContainerState(parent, outerRef, propertySignals.style, propertySignals.properties, propertySignals.default), [parent, propertySignals]);
    internals.interactionPanel.name = properties.name ?? '';
    useEffect(() => {
        if (outerRef.current == null || innerRef.current == null) {
            return;
        }
        const abortController = new AbortController();
        setupContainer(internals, parent, propertySignals.style, propertySignals.properties, outerRef.current, innerRef.current, abortController.signal);
        return () => abortController.abort();
    }, [parent, propertySignals, internals]);
    useComponentInternals(ref, parent.root, propertySignals.style, internals, internals.interactionPanel);
    return (_jsxs(AddHandlers, { handlers: internals.handlers, ref: outerRef, children: [_jsx("primitive", { object: internals.interactionPanel }), _jsx("object3D", { matrixAutoUpdate: false, ref: innerRef, children: _jsx(DefaultProperties, { ...internals.defaultProperties, children: _jsx(ParentProvider, { value: internals, children: properties.children }) }) })] }));
});
