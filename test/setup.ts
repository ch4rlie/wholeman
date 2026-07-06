import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for Reveal component
class MockIntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
  root = null;
  rootMargin = "";
  thresholds = [];
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
