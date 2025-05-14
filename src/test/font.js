import { jsx as _jsx } from "react/jsx-runtime";
import { MergedProperties, computedFont, measureGlyphLayout, } from '@pmndrs/uikit/internals';
import { signal } from '@preact/signals-core';
const { useThree } = window.ReactFiber;
const { useContext, createContext, useCallback, useMemo } = window.React;
const FontFamiliesContext = createContext(null);
export function FontFamilyProvider(properties) {
    let { children, ...fontFamilies } = properties;
    const existinFontFamilyUrls = useContext(FontFamiliesContext);
    if (existinFontFamilyUrls != null) {
        fontFamilies = { ...existinFontFamilyUrls, ...fontFamilies };
    }
    return _jsx(FontFamiliesContext.Provider, { value: fontFamilies, children: children });
}
export function useFontFamilies() {
    return useContext(FontFamiliesContext);
}
/**
 * @returns a function that measure the text and returns the width and height if the font is already loaded. Else undefined
 */
export function useMeasureText(fontFamily, fontWeight) {
    const propertiesSignal = useMemo(() => signal(new MergedProperties()), []);
    propertiesSignal.value = new MergedProperties();
    propertiesSignal.value.add('fontFamily', fontFamily);
    propertiesSignal.value.add('fontWeight', fontWeight);
    const renderer = useThree((state) => state.gl);
    const fontFamilies = useMemo(() => signal(undefined), []);
    fontFamilies.value = useFontFamilies();
    const font = useMemo(() => computedFont(propertiesSignal, fontFamilies, renderer), [fontFamilies, propertiesSignal, renderer]);
    return useCallback(async (properties) => {
        let fontValue = font.peek();
        if (fontValue == null) {
            fontValue = await new Promise((resolve) => {
                const unsubscribe = font.subscribe((font) => {
                    if (font == null) {
                        return;
                    }
                    unsubscribe();
                    resolve(font);
                });
            });
        }
        return measureGlyphLayout({ ...properties, font: fontValue }, properties.availableWidth);
    }, [font]);
}
