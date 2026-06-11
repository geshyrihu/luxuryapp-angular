import { normalizePrimeIconClass, resolvePrimeIcon, resolveIconifyIcon, resolveIcon } from './prime-icon-resolver';

describe('prime-icon-resolver', () => {
  it('normalizePrimeIconClass should exist', () => {
    expect(normalizePrimeIconClass).toBeDefined();
  });

  it('resolvePrimeIcon should exist', () => {
    expect(resolvePrimeIcon).toBeDefined();
  });

  it('resolveIconifyIcon should exist', () => {
    expect(resolveIconifyIcon).toBeDefined();
  });

  it('resolveIcon should exist', () => {
    expect(resolveIcon).toBeDefined();
  });
});
