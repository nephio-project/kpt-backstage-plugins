import { isFunction } from 'lodash';
import { Dispatch, SetStateAction, useCallback } from 'react';

type SetStateAndCallFn<S> = (setStateAction: SetStateAction<S>) => void;

export const useSetStateAndCall = <S extends object>(
  [state, setState]: [S, Dispatch<SetStateAction<S>>],
  callback: (newState: S) => void,
): SetStateAndCallFn<S> =>
  useCallback(
    setStateAction => {
      const newState = isFunction(setStateAction)
        ? setStateAction(state)
        : setStateAction;

      setState(newState);
      callback(newState);
    },
    [state, setState, callback],
  );
