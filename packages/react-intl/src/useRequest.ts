import { useEffect, useState } from 'react';

export enum Status {
  IDLE = 'idle',
  PENDING = 'pending',
  ERROR = 'error',
  SUCCESS = 'success',
}

export const useRequest = <R = Response>(
  url: string,
  fetcher: Fetcher<R>
): State<R> => {
  const [state, setState] = useState<State<R>>({
    status: Status.IDLE,
  });

  useEffect(() => {
    setState({ status: Status.PENDING });
    fetcher(url).then(
      (response) => {
        setState({ status: Status.SUCCESS, response });
      },
      (error: Error) => {
        setState({ status: Status.ERROR, error });
      }
    );
    // eslint-disable-next-line
  }, [url]);

  return state;
};

type Fetcher<R> = (url: string) => Promise<R>;

type State<R> =
  | {
      status: Status.IDLE | Status.PENDING;
    }
  | {
      status: Status.SUCCESS;
      response: R;
    }
  | {
      status: Status.ERROR;
      error: Error;
    };
