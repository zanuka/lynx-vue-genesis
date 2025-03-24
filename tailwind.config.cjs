const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const brandColor = colors.blue;

module.exports = {
	mode: 'jit',
	darkMode: 'class',
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./public/**/*.html',
		'./src/**/*.vue',
		'./node_modules/vue-tailwind-datepicker/**/*.js'
	],

	theme: {
		fontFamily: {
			sans: ['Roboto', 'Sans-serif']
		},
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px'
		},
		container: {
			padding: {
				DEFAULT: '1.375rem',
				sm: '1.375rem',
				lg: '1.375rem',
				xl: '1.375rem',
				'2xl': '1.375rem'
			}
		},
		extend: {
			colors: {
				'vtd-primary': {
					50: '#f6f6f6',
					100: '#e7e7e7',
					200: '#d1d1d1',
					300: '#b0b0b0',
					400: '#888888',
					500: 'var(--color-primary)',
					600: '#5d5d5d',
					700: '#4f4f4f',
					800: '#454545',
					900: '#3d3d3d',
					950: '#000000'
				},
				'vtd-secondary': {
					50: '#f6f6f6',
					100: '#e7e7e7',
					200: '#d1d1d1',
					300: '#b0b0b0',
					400: '#888888',
					500: 'var(--color-secondary)',
					600: '#5d5d5d',
					700: '#4f4f4f',
					800: '#454545',
					900: '#3d3d3d',
					950: '#000000'
				},
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				errorRed: '#f55064',
				uclaBlue: '#3284BF',
				progressBg: '#6379C8',
				statusGrey: '#374151',
				denim: {
					50: '#f7fafb',
					100: '#e4f2fc',
					200: '#c3def8',
					300: '#96bced',
					400: '#6895de',
					500: '#5070d0',
					600: '#4155bb',
					700: '#323f96',
					800: '#232a6b',
					900: '#141942'
				},
				royalblue: {
					50: '#f6f9fb',
					100: '#e1f0fc',
					200: '#c0dbf9',
					300: '#95b9f0',
					400: '#6991f0',
					500: '#556edc',
					600: '#4652cb',
					700: '#373daa',
					800: '#262a7d',
					900: '#161a4f'
				},
				steel: {
					50: '#f8f9f9',
					100: '#eceff6',
					200: '#d5dbec',
					300: '#b4b8cc',
					400: '#8591b7',
					500: '#6a6f9c',
					600: '#56547f',
					700: '#433f61',
					800: '#2e2b44',
					900: '#1c1b2a'
				},
				seagreen: {
					50: '#ebf4f1',
					100: '#c5f0ed',
					200: '#86ead4',
					300: '#00d499',
					400: '#16b778',
					500: '#0f9f4e',
					600: '#0e8c3a',
					700: '#0f6d30',
					800: '#0c4b26',
					900: '#092e1f'
				},
				sunset: {
					50: '#fdfcfa',
					100: '#fbf0ea',
					200: '#f8cfd4',
					300: '#efa1ac',
					400: '#eb7182',
					500: '#df4e60',
					600: '#c93443',
					700: '#a22731',
					800: '#761c21',
					900: '#491212'
				},
				gray: {
					50: '#f8f9f8',
					100: '#eeeff3',
					200: '#d9dbe5',
					300: '#b6b7ca',
					400: '#8e90a9',
					500: '#726f8a',
					600: '#5d546d',
					700: '#483f54',
					800: '#322c3b',
					900: '#1f1c25'
				},
				manatee: {
					50: '#fafafa',
					100: '#f3f1f3',
					200: '#e5dbe5',
					300: '#c7b6c6',
					400: '#a78ca0',
					500: '#89687d',
					600: '#6f4d5e',
					700: '#533946',
					800: '#38262f',
					900: '#21171d'
				}
			},
			// add fonts
			fontFamily: {
				mont: ['Roboto', 'sans-serif']
			},
			// Modify the default ring color so that it matches the brand color:
			ringColor: {
				DEFAULT: brandColor['500']
			}
		}
	},

	variants: {
		outline: ['focus']
	},

	// Add some basic Tailwind plugins to add additional features:
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms')
	]
};
