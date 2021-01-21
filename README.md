# react-use-auto-memo

`useMemo` for objects and arrays with automatic dependencies. Used with contexts to reduce re-renders.

## Installation

```
npm i react-use-auto-memo
```

## Features

* `useAutoMemo` accepts an object or an array and automatically creates a dependency array based on the object/array
* Small bundle size
* Written in TypeScript
* Descriptive error messages

## Examples

With object

```typescript
const useCount = () => {
    const [count, setCount] = useState(0);

    // use auto memo so that the containing object does not change until either count or setCount does
    const memoisedObject = useAutoMemo({ count, setCount });
    // this is equivalent to useMemo(() => ({ count, setCount }), [count, setCount])
    
    return memoisedObject;
};
```

With array

```typescript
import { useCallback } from "react";
import useAutoMemo from "./useAutoMemo";

const useMyAmazingHook = () => {
    const [names, setNames] = useState<string[]>([]);

    const sortedNames = useMemo(() => [...names].sort(), [names]);
    const addName = useCallback((name: string) => setNames(names => [...names, name]), [setNames]);

    // use auto memo so that the containing array does not change until either sortedNames or addName does
    return useAutoMemo([sortedNames, addName]);
}
```

## But why?

The intended use case for this hook is to memoise the value provided by a React context.

```typescript jsx
const Context = createContext({});

const MyContextProvider = ({ children }: MyContextProviderProps) => {
    const [names, setNames] = useState<string[]>([]);

    const sortedNames = useMemo(() => [...names].sort(), [names]);
    const addName = useCallback((name: string) => setNames(names => [...names, name]), [setNames]);
    
    const contextValue = useAutoMemo({ sortedNames, addName });
    
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

The idea is to stop the container object or array (passed to `useAutoMemo`) from changing when it does not have to. If we just did `<Context.Provider value={{ sortedNames, addName }}>...`, we will create a new object on every render and all consumers of the context will have to re-render. By first wrapping it in `useAutoMemo`, the container object will only change when one or more of its properties change. This, of course, requires all of its properties or elements to be the same (reference equal) on each render and they should therefore be wrapped in `useMemo`, `useCallback` or similar.

## Be careful

* This hook only works for objects and arrays
* The dependency array of the underlying `useMemo` is created from the object's values (`Object.values`) or the array itself. This means that **the number of properties in an object or elements in an array must not change between renders**.

----

If you want to reduce boilerplate when creating React contexts, check out [react-super-context](https://www.npmjs.com/package/react-super-context) which is the library that inspired me to create this. 
