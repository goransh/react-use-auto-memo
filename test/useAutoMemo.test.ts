import { renderHook } from "@testing-library/react-hooks";
import useAutoMemo from "../src";

const objects = [...Array(10).keys()].map(() => ({}));

test("Array with same elements should not change between renders", () => {
  const { result, rerender } = renderHook(() => useAutoMemo([...objects]));

  const firstResult = result.current;

  rerender();
  expect(firstResult).toBe(result.current);

  rerender();
  expect(firstResult).toBe(result.current);
});

test("Object with same elements should not change between renders", () => {
  const { result, rerender } = renderHook(() => useAutoMemo({ ...objects }));

  const firstResult = result.current;

  rerender();
  expect(firstResult).toBe(result.current);

  rerender();
  expect(firstResult).toBe(result.current);
});

test("Value should change when an array element changes", () => {
  const { result, rerender } = renderHook((props) => useAutoMemo(props), { initialProps: objects });

  const firstResult = result.current;

  const newProps = [...objects];
  newProps[0] = {};

  rerender(newProps);

  expect(firstResult).not.toBe(result.current);
});

test("Value should change when an object property changes", () => {
  const { result, rerender } = renderHook((props) => useAutoMemo({ ...props }), {
    initialProps: objects,
  });

  const firstResult = result.current;

  const newProps = [...objects];
  newProps[0] = {};

  rerender(newProps);

  expect(firstResult).not.toBe(result.current);
});

test("Verify that behaviour is different without hook", () => {
  const { result, rerender } = renderHook(() => [...objects]);

  const firstResult = result.current;

  rerender();

  const secondResult = result.current;

  expect(firstResult).not.toBe(secondResult);
});

test("Changing the number of properties should throw", () => {
  const { result, rerender } = renderHook((props) => useAutoMemo({ ...props }), {
    initialProps: objects,
  });
  rerender([...objects, {}]);

  expect(result.error).toBeInstanceOf(Error);
});

test("Passing an invalid value should throw", () => {
  const throwing = () => useAutoMemo((1 as unknown) as Record<string, any>);

  expect(throwing).toThrow();
});
