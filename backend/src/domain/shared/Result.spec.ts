import { Result } from './Result';

describe('Result', () => {
  it('should create a successful result', () => {
    const result = Result.ok('success data');
    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeNull();
    expect(result.getValue()).toBe('success data');
  });

  it('should create a failed result', () => {
    const result = Result.fail('error message');
    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('error message');
    
    expect(() => result.getValue()).toThrow("Can't get the value of an error result. Use 'error' instead");
  });

  it('should throw an error if a successful result has an error message', () => {
    expect(() => {
      new (Result as any)(true, 'error', null);
    }).toThrow("InvalidOperation: A result cannot be successful and contain an error");
  });

  it('should throw an error if a failing result does not have an error message', () => {
    expect(() => {
      new (Result as any)(false, null, null);
    }).toThrow("InvalidOperation: A failing result needs to contain an error message");
  });
});
