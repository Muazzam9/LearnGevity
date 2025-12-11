import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const baseInputStyles = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed';
  
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
      
      <input
        className={`${baseInputStyles} ${borderColor} ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;

