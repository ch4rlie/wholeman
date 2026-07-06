import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for Reveal component
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
