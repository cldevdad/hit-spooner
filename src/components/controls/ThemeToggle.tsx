import React from 'react';

interface ThemeToggleProps {
  setTheme: (theme: string) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ setTheme }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
  };

  return (
    <label>
      Theme:
      <select onChange={handleChange}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
};

export default ThemeToggle;
