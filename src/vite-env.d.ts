/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMPANY_NAME: string;
  readonly VITE_TAGLINE: string;
  readonly VITE_ALT_HEADLINE: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_PHONE: string;
  readonly VITE_EMAIL: string;
  readonly VITE_WEBSITE_URL: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
