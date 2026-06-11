import { resolveToIconify, resolveToPrime, PRIME_TO_ICONIFY, ICONIFY_TO_PRIME } from './icon-mapping';

describe('icon-mapping', () => {
  it('resolveToIconify should exist', () => {
    expect(resolveToIconify).toBeDefined();
  });

  it('resolveToPrime should exist', () => {
    expect(resolveToPrime).toBeDefined();
  });

  it('PRIME_TO_ICONIFY should exist', () => {
    expect(PRIME_TO_ICONIFY).toBeDefined();
  });

  it('ICONIFY_TO_PRIME should exist', () => {
    expect(ICONIFY_TO_PRIME).toBeDefined();
  });
});
