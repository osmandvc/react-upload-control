import { format } from "date-fns";

export function addUniqueTimestamp(s: string): string {
  return `${s} ${format(new Date(), "yyMMddHHmmss")}`;
}
