import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createSvgState, setupSvg } from '@pmndrs/uikit/internals';
const { forwardRef, useEffect, useMemo, useRef } = window.React;
import { AddHandlers, usePropertySignals } from './utils.js';
import { ParentProvider, useParent } from './context.js';
import { useComponentInternals } from './ref.js';
import { DefaultProperties } from './default.js';
export const Svg = forwardRef((properties, ref) => {
    const parent = useParent();
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const propertySignals = usePropertySignals(properties);
    const internals = useMemo(() => createSvgState(parent, outerRef, propertySignals.style, propertySignals.properties, propertySignals.default), [parent, propertySignals]);
    internals.interactionPanel.name = properties.name ?? '';
    useEffect(() => {
        if (outerRef.current == null || innerRef.current == null) {
            return;
        }
        const abortController = new AbortController();
        setupSvg(internals, parent, propertySignals.style, propertySignals.properties, outerRef.current, innerRef.current, abortController.signal);
        return () => abortController.abort();
    }, [parent, propertySignals, internals]);
    useComponentInternals(ref, parent.root, propertySignals.style, internals, internals.interactionPanel);
    return (_jsxs(AddHandlers, { ref: outerRef, handlers: internals.handlers, children: [_jsx("primitive", { object: internals.interactionPanel }), _jsx("primitive", { object: internals.centerGroup }), _jsx("object3D", { matrixAutoUpdate: false, ref: innerRef, children: _jsx(DefaultProperties, { ...internals.defaultProperties, children: _jsx(ParentProvider, { value: internals, children: properties.children }) }) })] }));
});
