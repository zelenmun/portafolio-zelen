// types/index.ts
export * from './github';

// Declaraciones globales para variables de entorno
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_GITHUB_TOKEN?: string;
    }
  }
}