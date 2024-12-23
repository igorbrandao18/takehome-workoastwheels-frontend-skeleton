import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-xl text-gray-600 mb-4">Something went wrong</p>
      <pre className="bg-gray-100 p-4 rounded-lg text-left mb-6 max-w-lg overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}; 