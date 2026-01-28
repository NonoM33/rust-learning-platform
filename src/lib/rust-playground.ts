export interface PlaygroundRequest {
  channel: 'stable' | 'beta' | 'nightly';
  mode: 'debug' | 'release';
  edition: '2015' | '2018' | '2021' | '2024';
  crateType: 'bin' | 'lib';
  tests: boolean;
  code: string;
  backtrace: boolean;
}

export interface PlaygroundResponse {
  success: boolean;
  stdout: string;
  stderr: string;
}

const PLAYGROUND_URL = 'https://play.rust-lang.org/execute';

export async function executeRustCode(
  code: string,
  options: Partial<PlaygroundRequest> = {}
): Promise<PlaygroundResponse> {
  const request: PlaygroundRequest = {
    channel: options.channel || 'stable',
    mode: options.mode || 'debug',
    edition: options.edition || '2021',
    crateType: options.crateType || 'bin',
    tests: options.tests || false,
    code,
    backtrace: options.backtrace || false,
  };

  try {
    const response = await fetch(PLAYGROUND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Playground API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: !data.stderr?.includes('error['),
      stdout: data.stdout || '',
      stderr: data.stderr || '',
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to execute code'
    );
  }
}

export async function formatRustCode(code: string): Promise<string> {
  const response = await fetch('https://play.rust-lang.org/format', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      edition: '2021',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to format code');
  }

  const data = await response.json();
  return data.code || code;
}

export async function shareCode(code: string): Promise<string> {
  const response = await fetch('https://play.rust-lang.org/meta/gist/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Failed to share code');
  }

  const data = await response.json();
  return `https://play.rust-lang.org/?gist=${data.id}`;
}
