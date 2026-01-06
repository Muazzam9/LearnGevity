import React from 'react';

const Select = ({
  label,
  error,
  helperText,
  required = false,
  options = [],
  placeholder = 'Select...',
  className = '',
  containerClassName = '',
  children,
  ...props
}) => {
  const baseSelectStyles = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white';
  
  const borderColor = error 
    ? 'border-red-400 focus:ring-red-400' 
    : 'border-gray-300';

  return (
    <div className={containerClassName}>
      {label && (
        <label 
          htmlFor={props.id || props.name} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          className={`${baseSelectStyles} ${borderColor} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          
          {children || options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;

