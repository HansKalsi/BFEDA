import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Google Maps and vis.gl map components depend on window.google. In tests we can stub minimal API when needed.
// You can enhance these stubs in individual tests as required.
// @ts-ignore
globalThis.google = globalThis.google || { maps: { LatLngLiteral: class {} } };

// jsdom does not implement matchMedia; Mantine uses it for color scheme.
if (typeof window !== 'undefined' && !window.matchMedia) {
	// @ts-ignore
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}));
}

// Polyfill ResizeObserver for Mantine ScrollArea
if (typeof window !== 'undefined' && !(window as any).ResizeObserver) {
	class ResizeObserverPolyfill {
		observe() {/* noop */}
		unobserve() {/* noop */}
		disconnect() {/* noop */}
	}
	// @ts-ignore
	window.ResizeObserver = ResizeObserverPolyfill as any;
}
