import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	entry: './src/lynx-app.ts',

	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.web.bundle',
		library: {
			type: 'umd',
			name: 'LynxVueApp'
		}
	},

	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},

			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/]
				}
			},

			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},

			{
				test: /\.lynx$/,
				use: [
					{
						loader: path.resolve('./lynx-loader.js'),
						options: {}
					}
				]
			}
		]
	},

	resolve: {
		extensions: ['.ts', '.js', '.vue', '.lynx'],
		alias: {
			vue$: 'vue/dist/vue.esm-bundler.js'
		}
	},

	plugins: [new VueLoaderPlugin()],

	mode: 'development',
	devtool: 'source-map'
};
