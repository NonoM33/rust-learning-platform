import { useState, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { executeRustCode, formatRustCode, shareCode } from '../../lib/rust-playground';

interface PlaygroundProps {
  initialCode?: string;
  title?: string;
  description?: string;
}

export function RustPlayground({
  initialCode = 'fn main() {\n    println!("Hello, Rust!");\n}',
  title,
  description,
}: PlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleRun = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setOutput('');
    setShareUrl(null);

    try {
      const result = await executeRustCode(code);
      setOutput(result.stdout + (result.stderr ? `\n${result.stderr}` : ''));
      if (!result.success) {
        setError('Erreur de compilation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Echec de l\'execution');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleFormat = useCallback(async () => {
    setIsLoading(true);
    try {
      const formatted = await formatRustCode(code);
      setCode(formatted);
    } catch (err) {
      setError('Echec du formatage');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleShare = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = await shareCode(code);
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
    } catch (err) {
      setError('Echec du partage');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setOutput('');
    setError(null);
    setShareUrl(null);
  }, [initialCode]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      {(title || description) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleRun}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-1.5 bg-rust-500 hover:bg-rust-600 disabled:bg-rust-500/50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Executer
        </button>

        <button
          onClick={handleFormat}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Formater
        </button>

        <button
          onClick={handleShare}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partager
        </button>

        <button
          onClick={handleReset}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        {shareUrl && (
          <span className="ml-auto text-xs text-green-500">
            Lien copie !
          </span>
        )}
      </div>

      {/* Editor */}
      <div className="p-4">
        <CodeEditor
          initialCode={code}
          onCodeChange={setCode}
          height="300px"
        />
      </div>

      {/* Output */}
      <div className="px-4 pb-4">
        <OutputPanel output={output} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
}
