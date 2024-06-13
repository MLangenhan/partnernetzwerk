import { useTheme } from '@/components/shared/ThemeContext';
import React, { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch"
export const Brightness: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 500); // Adjust the duration as needed
    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <div className="flex items-center space-x-2">
        {/*<input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
          disabled={isTransitioning} // Prevent toggling during transition
        />*/}
        <div className="flex items-center space-x-2">
          
          <Switch className='' id="airplane-mode" checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}  />
        </div>
        {/* Apply transition effect to the switch's background */}
        <span className={`slider ${isTransitioning ? 'transition-all duration-500' : ''}`}></span>
    </div>
  );
};
