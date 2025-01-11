import React from 'react';
import { Sliders } from 'lucide-react';

interface FilterButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      className="fixed bottom-5 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg lg:hidden"
      onClick={onClick}
    >
      <Sliders size={24} />
      <span className="sr-only">{isOpen ? 'Close filters' : 'Open filters'}</span>
    </button>
  );
};

export default FilterButton;

