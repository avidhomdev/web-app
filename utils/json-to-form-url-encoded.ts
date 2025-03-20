export function jsonToFormUrlEncoded(
  obj: Record<string, any>,
  prefix: string = "",
): string {
  const params = new URLSearchParams();

  function flatten(obj: any, currentKey: string = "") {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        flatten(item, `${currentKey}[${index}]`);
      });
    } else if (obj && typeof obj === "object") {
      Object.entries(obj).forEach(([key, value]) => {
        const newKey = currentKey ? `${currentKey}[${key}]` : key;
        if (typeof value === "object" && value !== null) {
          flatten(value, newKey);
        } else {
          params.append(newKey, String(value));
        }
      });
    } else {
      params.append(currentKey, String(obj));
    }
  }

  flatten(obj, prefix);
  return params.toString();
}
