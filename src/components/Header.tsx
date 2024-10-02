import React from 'react';
import '@fontsource/inter';
import { Github, Star } from 'lucide-react';

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
      <p className="text-base md:text-lg text-gray-300 text-center max-w-2xl mx-auto mb-4">
        {description}
      </p>
      <div className="flex justify-center mt-6">
        <a
          href="https://github.com/cfahlgren1/webllm-playground"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border-[var(--border-color)] border-[1.5px] bg-[var(--bg-color)] rounded-md text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
          aria-label="Star GitHub repository"
        >
          <Github size={18} className="mr-2" />
          <span>Star on GitHub</span>
          <Star size={18} className="ml-2" />
        </a>
      </div>
    </header>
  );
};

export default Header;