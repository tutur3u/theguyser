declare module "bun:test" {
  type TestCallback = () => Promise<void> | void;

  type Matchers<T> = {
    toBe(expected: T): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
    toMatchObject(expected: unknown): void;
  };

  type Expect = {
    <T>(actual: T): Matchers<T>;
    objectContaining(expected: unknown): unknown;
  };

  export const expect: Expect;
  export function describe(name: string, callback: TestCallback): void;
  export function test(name: string, callback: TestCallback): void;
}
