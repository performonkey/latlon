export default function(config, env, helpers) {
	config.module.noParse = /(mapbox-gl)\.js$/;

	helpers.getLoadersByName(config, 'css-loader').forEach(x =>
		Object.assign(x.loader.options, {
			camelCase: true,
			modules: true,
			sourceMap: true,
			localIdentName: '[name]-[local]--[hash:base64:5]'
		})
	);

	helpers
		.getLoadersByName(config, 'postcss-loader')
		.forEach(x =>
			x.loader.options.plugins.push(
				require('postcss-nested'),
				require('autoprefixer')({ browsers: ['last 2 versions', 'ios 8'] })
			)
		);

	if (env.production) {
		config.output.publicPath = '/latlon/';
	}
}
