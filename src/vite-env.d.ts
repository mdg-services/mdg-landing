/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Where the assistant's API lives. Absent in production, where the default
   * in `src/lib/assistApi.ts` is the right answer; set on a laptop to point
   * the widget at a backend running locally. See `.env.example`.
   */
  readonly VITE_ASSIST_API_BASE?: string;
}
