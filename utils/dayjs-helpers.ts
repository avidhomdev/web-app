import dayjs, { Dayjs } from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(LocalizedFormat);

export function dayjsLocalDate(day: Dayjs, localizedFormat = "LL") {
  return dayjs(day).format(localizedFormat);
}

export function dayjsLocalDateTime(day: Dayjs, localizedFormat = "L LT") {
  return dayjs(day).format(localizedFormat);
}
