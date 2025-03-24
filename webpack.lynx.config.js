import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	// Entry point for our Vue-Lynx integration
	entry: './src/lynx-app.ts',

	// Output configuration
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.web.bundle',
		library: {
			type: 'umd',
			name: 'LynxVueApp'
		}
	},

	// Module rules for different file types
	module: {
		rules: [
			// Handle Vue files
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},

			// Handle TypeScript files
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/]
				}
			},

			// Handle CSS files
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},

			// Handle Lynx template files (this would require a custom loader)
			{
				test: /\.lynx$/,
				use: [
					{
						loader: path.resolve('./lynx-loader.js'),
						options: {
							// Options for the loader
						}
					}
				]
			}
		]
	},

	// Resolve file extensions
	resolve: {
		extensions: ['.ts', '.js', '.vue', '.lynx'],
		alias: {
			vue$: 'vue/dist/vue.esm-bundler.js'
		}
	},

	// Plugins
	plugins: [
		new VueLoaderPlugin()
		// Would add Lynx specific plugins here
	],

	// Development options
	mode: 'development',
	devtool: 'source-map'
};
