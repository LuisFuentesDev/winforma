import { useEffect, useState } from "react";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useThemePreference() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, setDark };
}
