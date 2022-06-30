import { defineConfig } from 'windicss/helpers';
import plugin from 'windicss/plugin';
import colors from 'windicss/colors';

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
	},
	plugins: [
		plugin(({ addComponents }) => {
			const buttons = {
				'.btn': {
					padding: '.5rem 1rem',
					border: '2px solid black',
					borderBottomWidth: '6px',
					borderRadius: '.25rem',
					fontWeight: '700',
					'&:active': {
						borderBottomWidth: '2px',
						marginTop: '4px'
					}
				},
				'.btn-red': {
					background: colors.red[500],
					color: colors.white,
					'&:active': {
						background: colors.red[700]
					}
				}
			};
			addComponents(buttons);
		})
	]
});
