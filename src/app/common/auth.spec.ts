import { Auth } from './auth';

describe('Auth', () => {
  it('should create an instance', () => {
    expect(new Auth('test@example.com', 'password123', 'John', 'Doe', 'http://example.com/image.jpg')).toBeTruthy();
  });
});
