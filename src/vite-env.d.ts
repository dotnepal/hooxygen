/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT: string
  readonly NODE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
