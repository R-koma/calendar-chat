import api from './api';

describe('api instance', () => {
  it('should have the correct baseURL', () => {
    expect(api.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_URL);
  });

  it('should include credentials with requests', () => {
    expect(api.defaults.withCredentials).toBe(true);
  });
});
