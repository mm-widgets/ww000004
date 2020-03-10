const { join } = require('path');

module.exports = {
	mode: 'none',
	watch: true,
	entry: './dist/tests/test.js',
	output: {
		path: join(__dirname, 'dist'),
		filename: 'ie.js'
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				// exclude: /(node_modules|bower_components)/,
				exclude: /core-js|babel|tus-js-client/,
				use: {
					loader: 'babel-loader',
					options: {
						sourceType: 'unambiguous',
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										'ie': '10'
									}
								}
							]
						],
						plugins: [
							'@babel/plugin-transform-typeof-symbol',
							'@babel/plugin-transform-runtime'
							// ['@babel/plugin-transform-regenerator', {
							// 	"asyncGenerators": true,
							// 	"generators": true,
							// 	"async": true
							// }],
							// '@babel/plugin-proposal-object-rest-spread'
						]
					}
				}
			}
		]
	}
};
