import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <p className="text-mist max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 rounded-lg border border-line px-4 py-2 text-sm hover:border-cyan hover:text-cyan transition-colors">
          Try again
        </button>
      )}
    </div>
  );
}
