import React from 'react';
import '@fontsource/inter';

interface HeaderProps {
  heading: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ heading, description }) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16">
      <h1 className="text-3xl sm:text-2xl md:text-4xl font-extrabold mb-4 sm:mb-6 text-center text-white">
        {heading}
      </h1>
      <p className="text-base md:text-lg text-gray-300 text-center max-w-2xl mx-auto">
        {description}
      </p>
    </header>
  );
};

export default Header;