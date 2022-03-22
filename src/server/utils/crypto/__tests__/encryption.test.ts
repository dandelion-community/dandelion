import { decrypt, encrypt } from '../encryption';

describe('encryption', () => {
  it('should be symmetric', () => {
    const message = 'aosdifjapsodifjas;ldkfjadslkfjasd;lfkj dsf';
    expect(decrypt(encrypt(message))).toBe(message);
  });
});
