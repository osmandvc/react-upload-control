import { yellow, red } from "kleur";

const VERBOSE = true;

export function formatError(e: any, doIncludeStack: boolean = true): string {
  if (VERBOSE) {
    console.error(e);
  }

  let message = "Unbekannter Fehler aufgetreten.";

  if (e instanceof Error) {
    if (typeof e.message === "object") {
      try {
        message = JSON.stringify(e.message);
      } catch {
        message = e.message;
      }
    } else {
      message = e.message;
    }
  } else if (e && typeof e === "object" && "message" in e) {
    message = String(e.message);
  } else if (
    e &&
    typeof e === "object" &&
    "errors" in e &&
    Array.isArray(e.errors)
  ) {
    const messages = e.errors.reduce((acc: string[], error: any) => {
      let m = error?.message || "unspecific error";
      try {
        m += " " + JSON.stringify(error.extensions ?? {});
      } catch (e) {}
      acc.push(m);
      return acc;
    }, []);
    message = messages.join(", ");
  } else if (e && typeof e === "object") {
    try {
      message = JSON.stringify(e);
    } catch {
      message = "Unserializable object";
    }
  } else if (Array.isArray(e)) {
    message = e.toString();
  } else if (e && typeof e === "string") {
    message = e;
  } else {
    // unknown error
  }

  if (doIncludeStack && e.cause) {
    message += "\n" + e.cause;
  }

  if (doIncludeStack && e.stack) {
    message += "\n" + e.stack;
  }

  return message;
}

export function consoleWarn(...args: any) {
  const warnings = args?.map((w: any) => formatError(w));

  console.error(yellow("[CAUGHT WARN]: " + warnings.join(": ")));
}

export function consoleError(...args: any) {
  const errors = args?.map((e: any) => formatError(e));

  console.error(red("[CAUGHT ERROR]:" + errors.join(": ")));
}
