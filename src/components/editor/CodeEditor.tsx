import { useEffect, useState } from 'react';

interface CodeEditorProps {
  initialCode?: string;
  readOnly?: boolean;
  height?: string;
  onCodeChange?: (code: string) => void;
}

export function CodeEditor({
  initialCode = '// Ecris ton code Rust ici\nfn main() {\n    println!("Hello, Rust!");\n}',
  readOnly = false,
  height = '300px',
  onCodeChange,
}: CodeEditorProps) {
  const [Editor, setEditor] = useState<React.ComponentType<any> | null>(null);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [mounted, setMounted] = useState(false);

  // Dynamic import of Monaco Editor (client-side only)
  useEffect(() => {
    setMounted(true);
    import('@monaco-editor/react').then((mod) => {
      setEditor(() => mod.default);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'vs-dark' : 'light');

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'vs-dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [mounted]);

  const handleChange = (value: string | undefined) => {
    if (value !== undefined && onCodeChange) {
      onCodeChange(value);
    }
  };

  // Loading state or SSR
  if (!Editor) {
    return (
      <div
        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-gray-400 text-sm">Chargement de l'editeur...</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="rust"
        defaultValue={initialCode}
        theme={theme}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: 'on',
          automaticLayout: true,
          readOnly,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          folding: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
