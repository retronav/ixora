import { defineConfig } from 'windicss/helpers';

export default defineConfig({
	preflight: false,
	theme: {
		extend: {
			colors: {
				melon: '#FFC3AD',
				scarlet: '#FF2400'
			},
			width: {
				fit: 'fit-content'
			}
		}
	}
});
