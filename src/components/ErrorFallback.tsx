import { FallbackProps } from 'react-error-boundary';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
} 