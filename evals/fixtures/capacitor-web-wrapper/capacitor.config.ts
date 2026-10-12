import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.quoteboard',
  appName: 'Quote Board',
  webDir: 'dist',
  server: {
    url: 'https://quoteboard.example.com',
    cleartext: false,
  },
};

export default config;
