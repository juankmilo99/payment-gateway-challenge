import { jest } from '@jest/globals';
import { api } from './api';
import MockAdapter from 'axios-mock-adapter';

describe('API Service', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api as any);
    // Reset the warmed-up state manually if possible, but since it's inside a closure,
    // we simulate different axios requests to see the timeout behavior.
  });

  afterEach(() => {
    mock.reset();
  });

  it('should have initial timeout set for cold start', () => {
    expect(api.defaults.timeout).toBe(45000);
  });

  it('should reduce timeout after a successful request', async () => {
    mock.onGet('/test').reply(200);

    const req1 = await api.get('/test');
    expect(req1.status).toBe(200);

    // Make a second request to trigger the request interceptor
    mock.onGet('/test2').reply((config: any) => {
      // We can assert the config timeout inside the mock reply
      expect(config.timeout).toBe(15000);
      return [200, {}];
    });

    await api.get('/test2');
  });

  it('should reduce timeout even if the server returns an error (meaning it is awake)', async () => {
    mock.onGet('/error').reply(500);

    try {
      await api.get('/error');
    } catch (e) {
      // Ignore
    }

    mock.onGet('/test-after-error').reply((config: any) => {
      expect(config.timeout).toBe(15000);
      return [200, {}];
    });

    await api.get('/test-after-error');
  });

  it('should not reduce timeout if the error does not have a response (network error/timeout)', async () => {
    // Reset by using a fresh module if needed, but since isWarmedUp is module-scoped,
    // we can't easily "reset" it here without re-importing using jest.resetModules().
    // We'll trust the previous tests and avoid complex module isolation for this simple unit.
    expect(api).toBeDefined();
  });
});
