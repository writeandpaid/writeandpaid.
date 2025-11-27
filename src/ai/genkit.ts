
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { genkitEval, GenkitMetric } from '@genkit-ai/evaluator';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

// Enable Firebase telemetry and monitoring.
enableFirebaseTelemetry();

// Initialize Genkit with plugins
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1beta' }),
    genkitEval({
      judge: 'googleai/gemini-1.5-flash-latest',
      metrics: [GenkitMetric.FAITHFULNESS, GenkitMetric.MALICIOUSNESS],
      embedder: 'googleai/text-embedding-004',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
