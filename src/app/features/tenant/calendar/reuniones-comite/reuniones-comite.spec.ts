import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

describe('ReunionesComite', () => {
  it('should be a placeholder (commented out component)', () => {
    expect(true).toBe(true);
  });
});
