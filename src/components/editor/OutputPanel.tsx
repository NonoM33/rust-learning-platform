interface OutputPanelProps {
  output: string;
  error: string | null;
  isLoading: boolean;
}

export function OutputPanel({ output, error, isLoading }: OutputPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Compilation en cours...</span>
        </div>
      </div>
    );
  }

  if (!output && !error) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-500">
        <p>Clique sur "Executer" pour voir le resultat</p>
      </div>
    );
  }

  const hasError = error || output.includes('error[');

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className={`px-4 py-2 text-xs font-medium border-b border-gray-800 ${hasError ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
        {hasError ? 'Erreur de compilation' : 'Execution reussie'}
      </div>
      <pre className="p-4 font-mono text-sm overflow-x-auto max-h-64 overflow-y-auto">
        <code className={hasError ? 'text-red-400' : 'text-green-400'}>
          {output || error}
        </code>
      </pre>
    </div>
  );
}
