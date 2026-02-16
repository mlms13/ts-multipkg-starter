import { describe, expect, it } from 'vitest';

import { two } from '../src/index';

describe('client', () => {
  it('computes two from library one', () => {
    expect(two).toBe(2);
  });
});
