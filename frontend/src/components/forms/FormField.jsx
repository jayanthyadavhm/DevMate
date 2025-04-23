import { cloneElement } from 'react';

const FormField = ({
  label,
  error,
  helpText,
  required,
  children,
  className = '',
}) => {
  // Generate a unique ID for the input if not provided
  const inputId = children.props.id || `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  // Clone the child element (input/select/textarea) and pass the id
  const inputElement = cloneElement(children, {
    id: inputId,
    'aria-describedby': error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined,
    'aria-invalid': error ? 'true' : undefined,
    required,
  });

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {inputElement}
      {(error || helpText) && (
        <p
          id={error ? `${inputId}-error` : `${inputId}-help`}
          className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
        >
          {error || helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;
