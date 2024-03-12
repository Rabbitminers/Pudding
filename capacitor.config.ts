import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rabbitminers.pudding',
  appName: 'Pudding',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    url: "http://192.168.1.101:5173/",
    cleartext: true
  }
};

export default config;
