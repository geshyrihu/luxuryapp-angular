import { imageToBase64, onGetSelectItemFromEnum } from './enumeration';

describe('enumeration helpers', () => {
  it('imageToBase64 should exist', () => {
    expect(imageToBase64).toBeDefined();
  });

  it('onGetSelectItemFromEnum should exist', () => {
    expect(onGetSelectItemFromEnum).toBeDefined();
  });
});
