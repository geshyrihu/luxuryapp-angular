import { EBoolTextPipe } from './bool-text.pipe';

describe('EBoolTextPipe', () => {
  const pipe = new EBoolTextPipe();

  it('should return "Si" for true', () => {
    expect(pipe.transform(true)).toBe('Si');
  });

  it('should return "No" for false', () => {
    expect(pipe.transform(false)).toBe('No');
  });
});
