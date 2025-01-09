import { useCallback, useState } from "react";

export enum STATUS {
  IDLE = "IDLE",
  LOADING = "LOADING",
  PROCESSING = "PROCESSING",
  ERROR = "ERROR",
  READY = "READY",
  PENDING = "PENDING",
}

const defaultStatus = STATUS.IDLE;

export function useStateMachine(initialStatus?: string, initialValue?: any) {
  const [status, setStatus] = useState<string>(initialStatus ?? defaultStatus);
  const [value, setValue] = useState<any>(initialValue);
  const [error, setError] = useState<string | Error | undefined>(undefined);

  const resetStatus = useCallback((newStatus: string) => {
    setStatus(newStatus || defaultStatus);
    setError(undefined);
    setValue(undefined);
  }, []);

  const statusSetter = useCallback(
    (newStatus: string, error?: string | Error | undefined, value?: any) => {
      setStatus(newStatus);
      if (error) setError(error);
      if (value) setValue(value);
    },
    [],
  );

  const statusGetter = () => status;

  function getErrorString() {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    return JSON.stringify(error);
  }

  function statusIs(...args: string[]) {
    return args.some((s) => s === status);
  }

  function statusIsnt(...args: string[]) {
    return args.every((s) => s !== status);
  }

  return {
    smStatus: status,
    smStatusIs: statusIs,
    smStatusIsnt: statusIsnt,
    smIsError: !!error,
    smError: error,
    smErrorString: getErrorString(),
    smValue: value,
    smGetStatus: statusGetter,
    smSetStatus: statusSetter,
    smResetStatus: resetStatus,
    status: STATUS,
  };
}
