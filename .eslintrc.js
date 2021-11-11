module.exports = {
	"env": {
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": "./tsconfig.json"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"@typescript-eslint/no-namespace": "off",
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"double"
		],
		"semi": [
			"always"
		]
	}
};
