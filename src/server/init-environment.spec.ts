import './init-environment';

describe('init-environment test', () => {
  test('should environments will be loaded correctly', () => {
    expect(process.env.GITHUB_CLIENT_ID).toBeTruthy();
    expect(process.env.GITHUB_CLIENT_SECRET).toBeTruthy();
  });
});
