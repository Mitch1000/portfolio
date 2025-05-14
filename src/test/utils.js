import { jsx as _jsx } from "react/jsx-runtime";
import { effect, signal } from '@preact/signals-core';
const { forwardRef, useEffect, useMemo, useState } = window.React;
import { useDefaultProperties } from './default.js';
export const AddHandlers = forwardRef(({ handlers: handlersSignal, children }, ref) => {
    const [handlers, setHandlers] = useState(() => handlersSignal.peek());
    useEffect(() => effect(() => {
        const handlers = handlersSignal.value;
        const ref = void setTimeout(() => setHandlers(handlers), 0);
        return () => clearTimeout(ref);
    }), [handlersSignal]);
    return (_jsx("object3D", { ref: ref, matrixAutoUpdate: false, ...handlers, children: children }));
});
export function usePropertySignals(properties) {
    const propertySignals = useMemo(() => ({
        style: signal(undefined),
        properties: signal(undefined),
        default: signal(undefined),
    }), []);
    propertySignals.properties.value = properties;
    propertySignals.default.value = useDefaultProperties();
    return propertySignals;
}
