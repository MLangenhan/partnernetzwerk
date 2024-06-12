import { useTheme } from '@/components/shared/ThemeContext';
import React, { useEffect, useState } from 'react';

export const Switch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 500); // Adjust the duration as needed
    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <div className="container-switch">
      <span>Change Theme </span>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
          disabled={isTransitioning} // Prevent toggling during transition
        />
        {/* Apply transition effect to the switch's background */}
        <span className={`slider ${isTransitioning ? 'transition-all duration-500' : ''}`}></span>
      </label>
    </div>
  );
};
