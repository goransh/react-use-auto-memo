import { useMemo, useRef } from "react";

const devEnvironment = process.env.NODE_ENV === "development";

export type AutoMemoable = Record<string, any> | Array<any>;

function getDeps(value: AutoMemoable) {
  if (value instanceof Array) {
    return value;
  } else if (typeof value === "object") {
    return Object.values(value);
  }
  throw Error(
    "Value passed to useAutoMemo is not auto memoable. It must either be an object or an array."
  );
}

function useAutoMemo<T extends AutoMemoable>(value: T) {
  const deps = getDeps(value);
  if (devEnvironment) {
    const depsCount = useRef(deps.length);
    if (deps.length !== depsCount.current) {
      const valueType = `${value instanceof Array ? "array" : "object"}`;
      throw Error(
        `The number of values in the ${valueType} passed to the useAutoMemo changed between renders. You can only use this hook with object or arrays that have a consistent number of values.`
      );
    }
    depsCount.current = deps.length;
  }

  return useMemo(() => value, deps);
}

export default useAutoMemo;
