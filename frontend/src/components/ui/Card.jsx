const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-5 py-5 sm:px-6 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-5 py-4 sm:px-6 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
