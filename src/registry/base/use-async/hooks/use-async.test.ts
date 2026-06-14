import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsync } from "./use-async";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
describe("useAsync", () => {
  it("start idle, goes pending, then success with the resolved data", async () => {
    const { result } = renderHook(() =>
      useAsync({ action: async (n: number) => n * 2 }),
    );
    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBeUndefined();

    await act(async () => {
      await result.current.executeAsync(2);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe(4);
    expect(result.current.error).toBeUndefined();
  });

  it("goes to error state when the action rejects", async () => {
    const boom = new Error("boom");
    const { result } = renderHook(() =>
      useAsync({
        action: async () => {
          throw boom;
        },
      }),
    );

    await act(async () => {
      await expect(result.current.executeAsync()).rejects.toThrow("boom");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(boom);
    expect(result.current.data).toBeUndefined();
  });

  it("drop a stale response: an earlier request finishing later cannot win", async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const calls = [first, second];

    let callIndex = 0;

    const { result } = renderHook(() =>
      // call first  , then second
      useAsync({
        action: () => calls[callIndex++].promise,
        onSuccess,
        onError,
      }),
    );

    let stale_result!: Promise<string>;
    let fresh_result!: Promise<string>;

    await act(async () => {
      stale_result = result.current.executeAsync();
      // last
      fresh_result = result.current.executeAsync();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      // resolve second promise (fresh)
      second.resolve("fresh");
    });

    await act(async () => {
      // resolve first promise (stale)
      first.resolve("stale");
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe("fresh");
    expect(result.current.data).not.toBe("stale");

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith("fresh", []);
    expect(onError).not.toHaveBeenCalled();
  });

  it("reset returns to idle and block a late in-flight commit", async () => {
    const d = deferred<string>();
    const { result } = renderHook(() => useAsync({ action: () => d.promise }));

    let p!: Promise<string>;
    act(() => {
      p = result.current.executeAsync();
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isIdle).toBe(true);

    await act(async () => {
      d.resolve("this should not be dismissed");
      await p;
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
