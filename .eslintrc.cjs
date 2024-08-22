module.exports = {
	extends: ['eslint:recommended', 'prettier'],
	plugins: [`prettier`],
	parserOptions: {
		sourceType: `module`,
		ecmaVersion: `latest`
	},
	env: {
		node: true,
		es2020: true
	}
}
