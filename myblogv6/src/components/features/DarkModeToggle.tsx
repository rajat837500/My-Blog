import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Fetch theme from localStorage after mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(storedTheme);
  }, []);

  // Apply theme when darkMode changes
  useEffect(() => {
    if (darkMode !== null) {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="w-9 h-9 lg:w-10 lg:h-10 flex justify-center items-center rounded-full transition-all duration-400 "
    >
      {darkMode !== null && (
        <>
          <Sun className="absolute size-6 text-icon-bg transition-all duration-300 transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
          <Moon className="absolute size-6 text-icon-bg transition-all duration-300 transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
        </>
      )}
    </button>
  );
}
