import { useEffect, useState } from "react";

export function useLogoAvailable(src: string): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setAvailable(true);
    };
    img.onerror = () => {
      if (!cancelled) setAvailable(false);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return available;
}
