import { jsx as _jsx } from "react/jsx-runtime";
const { forwardRef, useEffect, useMemo, useRef } = window.React;
import { useParent } from './context.js';
import { AddHandlers, usePropertySignals } from './utils.js';
import { createTextState, setupText } from '@pmndrs/uikit/internals';
import { useComponentInternals } from './ref.js';
import { signal } from '@preact/signals-core';
import { useFontFamilies } from './font.js';
export const Text = forwardRef((properties, ref) => {
    const parent = useParent();
    const outerRef = useRef(null);
    const propertySignals = usePropertySignals(properties);
    const textSignal = useMemo(() => signal(undefined), []);
    textSignal.value = properties.children;
    const fontFamilies = useMemo(() => signal(undefined), []);
    fontFamilies.value = useFontFamilies();
    const internals = useMemo(() => createTextState(parent, textSignal, fontFamilies, propertySignals.style, propertySignals.properties, propertySignals.default), [fontFamilies, parent, propertySignals, textSignal]);
    internals.interactionPanel.name = properties.name ?? '';
    useEffect(() => {
        if (outerRef.current == null) {
            return;
        }
        const abortController = new AbortController();
        setupText(internals, parent, propertySignals.style, propertySignals.properties, outerRef.current, abortController.signal);
        return () => abortController.abort();
    }, [parent, propertySignals, internals]);
    useComponentInternals(ref, parent.root, propertySignals.style, internals, internals.interactionPanel);
    return (_jsx(AddHandlers, { handlers: internals.handlers, ref: outerRef, children: _jsx("primitive", { object: internals.interactionPanel }) }));
});
