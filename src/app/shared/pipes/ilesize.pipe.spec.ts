import { FilesizePipe } from './ilesize.pipe';

describe('FilesizePipe', () => {
  const pipe = new FilesizePipe();

  it('should return "0 Bytes" for 0', () => {
    expect(pipe.transform(0)).toBe('0 Bytes');
  });

  it('should format bytes', () => {
    expect(pipe.transform(500)).toBe('500 Bytes');
  });

  it('should format KB', () => {
    const result = pipe.transform(1024);
    expect(result).toContain('KB');
  });

  it('should format MB', () => {
    const result = pipe.transform(1048576);
    expect(result).toContain('MB');
  });

  it('should format GB', () => {
    const result = pipe.transform(1073741824);
    expect(result).toContain('GB');
  });

  it('should respect custom decimals parameter', () => {
    const result = pipe.transform(1536, 0);
    expect(result).toBe('2 KB');
  });

  it('should default decimals to 2', () => {
    const result = pipe.transform(1536);
    expect(result).toBe('1.5 KB');
  });

  it('should handle undefined bytes as 0', () => {
    expect(pipe.transform(undefined as any)).toBe('0 Bytes');
  });
});
