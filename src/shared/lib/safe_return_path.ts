const LOCAL_ORIGIN = "https://local.invalid";

export function getSafeReturnPath(value: string | null | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  try {
    const url = new URL(value, LOCAL_ORIGIN);

    if (url.origin !== LOCAL_ORIGIN) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
