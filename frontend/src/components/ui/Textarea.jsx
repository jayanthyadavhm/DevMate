import { forwardRef } from 'react';

const Textarea = forwardRef(({
  error,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <textarea
        rows={rows}
        ref={ref}
        className={`
          block w-full rounded-md
          ${error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          shadow-sm
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${className}
        `.trim()}
        {...props}
      />
      {error && (
        <div className="absolute top-2 right-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
