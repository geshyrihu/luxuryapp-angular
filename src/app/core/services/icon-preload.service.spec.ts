import { preloadIconifyIcons } from './icon-preload.service';

describe('preloadIconifyIcons', () => {
  it('should return an async function', () => {
    const fn = preloadIconifyIcons();
    expect(typeof fn).toBe('function');
  });
});
