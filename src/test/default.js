import { jsx as _jsx } from "react/jsx-runtime";
const { createContext, useContext } = window.React;
const DefaultPropertiesContext = createContext(undefined);
export function useDefaultProperties() {
    return useContext(DefaultPropertiesContext);
}
export function DefaultProperties(properties) {
    const existingDefaultProperties = useContext(DefaultPropertiesContext);
    const result = { ...existingDefaultProperties };
    for (const key in properties) {
        if (key === 'children') {
            continue;
        }
        //TODO: this is not correctly merged but rather overwritten
        const value = properties[key];
        if (value == null) {
            continue;
        }
        result[key] = value;
    }
    return _jsx(DefaultPropertiesContext.Provider, { value: result, children: properties.children });
}
