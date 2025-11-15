
import React from 'react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  unit?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, id, unit, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 pr-10"
          {...props}
        />
        {unit && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
