import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.quoteboard.app',
  appName: 'Quote Board',
  webDir: 'dist',
  server: {
    url: 'https://quoteboard.co',
    cleartext: false,
  },
};

export default config;
