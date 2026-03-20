/**
 * Classification pattern constants for file type detection.
 */

/** Minimum exports to consider a file as a barrel export */
export const BARREL_EXPORT_MIN_EXPORTS = 5;

/** Token cost limit for barrel export detection */
export const BARREL_EXPORT_TOKEN_LIMIT = 1000;

/** Patterns for Lambda/API handler detection */
export const HANDLER_NAME_PATTERNS = [
  'handler',
  '.handler.',
  '-handler.',
  'lambda',
  '.lambda.',
  '-lambda.',
];

/** Patterns for service file detection */
export const SERVICE_NAME_PATTERNS = [
  'service',
  '.service.',
  '-service.',
  '_service.',
];

/** Patterns for email template detection */
export const EMAIL_NAME_PATTERNS = [
  '-email-',
  '.email.',
  '_email_',
  '-template',
  '.template.',
  '_template',
  '-mail.',
  '.mail.',
];

/** Patterns for parser/transformer detection */
export const PARSER_NAME_PATTERNS = [
  'parser',
  '.parser.',
  '-parser.',
  '_parser.',
  'transform',
  'converter',
  'mapper',
  'serializer',
];

/** Patterns for session/state management detection */
export const SESSION_NAME_PATTERNS = ['session', 'state', 'context', 'store'];

/** Next.js metadata export names */
export const NEXTJS_METADATA_EXPORTS = [
  'metadata',
  'generatemetadata',
  'faqjsonld',
  'jsonld',
  'icon',
];

/** Patterns for configuration file detection */
export const CONFIG_NAME_PATTERNS = [
  '.config.',
  'tsconfig',
  'jest.config',
  'package.json',
  'aiready.json',
  'next.config',
  'sst.config',
];
