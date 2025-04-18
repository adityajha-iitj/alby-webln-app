import { Switch } from '@headlessui/react';

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm">
        {darkMode ? '🌙' : '☀️'}
      </span>
      <Switch
        checked={darkMode}
        onChange={setDarkMode}
        className={`${
          darkMode ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Toggle dark mode</span>
        <span
          className={`${
            darkMode ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
}

export default ThemeToggle;