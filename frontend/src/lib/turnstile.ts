/**
 * Cloudflare Turnstile server-side verification utilities
 */

export interface TurnstileVerificationResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify Turnstile token on the server side
 * @param token - The token received from the client
 * @param remoteip - The user's IP address (optional)
 * @returns Promise with verification result
 */
export async function verifyTurnstileToken(
  token: string,
  remoteip?: string
): Promise<TurnstileVerificationResponse> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TURNSTILE_SECRET_KEY environment variable is not set');
  }

  if (!token) {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
    };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: TurnstileVerificationResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      'error-codes': ['internal-error'],
    };
  }
}

/**
 * Middleware to verify Turnstile token in API routes
 * @param token - The token to verify
 * @param remoteip - The user's IP address (optional)
 * @throws Error if verification fails
 */
export async function validateTurnstileToken(
  token: string,
  remoteip?: string
): Promise<void> {
  const result = await verifyTurnstileToken(token, remoteip);

  if (!result.success) {
    const errorCodes = result['error-codes'] || ['unknown-error'];
    const errorMessage = getTurnstileErrorMessage(errorCodes[0]);
    throw new Error(errorMessage);
  }
}

/**
 * Get human-readable error message for Turnstile error codes
 * @param errorCode - The error code from Turnstile
 * @returns Human-readable error message
 */
function getTurnstileErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'missing-input-secret': 'Server configuration error',
    'invalid-input-secret': 'Server configuration error', 
    'missing-input-response': 'CAPTCHA verification required',
    'invalid-input-response': 'Invalid CAPTCHA token',
    'bad-request': 'Invalid request format',
    'timeout-or-duplicate': 'CAPTCHA token expired or already used',
    'internal-error': 'Verification service unavailable',
    'unknown-error': 'CAPTCHA verification failed',
  };

  return errorMessages[errorCode] || 'CAPTCHA verification failed';
}

/**
 * Extract IP address from request headers (for Next.js API routes)
 * @param headers - Request headers
 * @returns IP address string
 */
export function getClientIP(headers: Headers): string | undefined {
  // Check common headers for real IP
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // These are less reliable but might be available
  return headers.get('remote-addr') || undefined;
}