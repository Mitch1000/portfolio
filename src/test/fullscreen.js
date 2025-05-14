import { jsx as _jsx } from "react/jsx-runtime";
const { forwardRef, useEffect, useMemo, useRef } = window.React;
import { Root } from './root.js';
import { batch, signal } from '@preact/signals-core';
const { createPortal, useFrame, useStore, useThree } = window.ReactFiber;
import { updateSizeFullscreen } from '@pmndrs/uikit/internals';
export const Fullscreen = forwardRef((properties, ref) => {
    const store = useStore();
    const camera = useThree((s) => s.camera);
    const distanceToCamera = properties.distanceToCamera ?? camera.near + 0.1;
    const [sizeX, sizeY, pixelSize] = useMemo(() => {
        const sizeX = signal(1);
        const sizeY = signal(1);
        const pixelSize = signal(1);
        updateSizeFullscreen(sizeX, sizeY, pixelSize, distanceToCamera, camera, store.getState().size.height);
        return [sizeX, sizeY, pixelSize];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const hasAttached = useRef(false);
    useFrame(({ camera, scene, size: { height } }) => {
        batch(() => updateSizeFullscreen(sizeX, sizeY, pixelSize, distanceToCamera, camera, height));
        //attach camera to something so we can see the camera
        if (camera.parent == null && (properties.attachCamera ?? true)) {
            scene.add(camera);
            hasAttached.current = true;
        }
    });
    //cleanup attaching the camera
    useEffect(() => () => {
        if (!hasAttached.current) {
            return;
        }
        const { camera, scene } = store.getState();
        if (camera.parent != scene) {
            return;
        }
        scene.remove(camera);
    }, [store]);
    return createPortal(_jsx("group", { "position-z": -distanceToCamera, children: _jsx(Root, { ref: ref, ...properties, sizeX: sizeX, sizeY: sizeY, pixelSize: pixelSize, children: properties.children }) }), camera);
});
