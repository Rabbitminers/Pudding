import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.rabbitminers.pudding',
	appName: 'Pudding',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
