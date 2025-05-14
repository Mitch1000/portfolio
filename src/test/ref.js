import { untracked } from '@preact/signals-core';
const { useImperativeHandle } = window.React;
const { Mesh } = window.THREE;
export function useComponentInternals(ref, root, styleSignal, internals, interactionPanel, additional) {
    useImperativeHandle(ref, () => {
        const { scrollPosition, paddingInset, borderInset, globalMatrix, relativeCenter, size, maxScrollPosition } = internals;
        return {
            isVisible: internals.isVisible,
            setStyle: (style, replace) => (styleSignal.value = replace ? style : { ...styleSignal.value, ...style }),
            getStyle: () => styleSignal.peek(),
            getComputedProperty: (key) => untracked(() => internals.mergedProperties.value.read(key, undefined)),
            pixelSize: root.pixelSize,
            root,
            borderInset,
            paddingInset,
            center: relativeCenter,
            globalMatrix,
            maxScrollPosition,
            size,
            interactionPanel: interactionPanel instanceof Mesh ? interactionPanel : interactionPanel.current,
            scrollPosition,
            isClipped: internals.isClipped,
            ...additional,
        };
    }, [internals, root, interactionPanel, additional, styleSignal]);
}
