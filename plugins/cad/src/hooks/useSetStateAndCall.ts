import { Dispatch, SetStateAction, useCallback } from 'react';

type SetStateAndCallFn<S> = (createNewState: (currentState: S) => S) => void;

export const useSetStateAndCall = <S extends object>(
  [state, setState]: [S, Dispatch<SetStateAction<S>>],
  callback: (newState: S) => void,
): SetStateAndCallFn<S> =>
  useCallback(
    createNewState => {
      const newState = createNewState(state);
      setState(newState);
      callback(newState);
    },
    [state, setState, callback],
  );
