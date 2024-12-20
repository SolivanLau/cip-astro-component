/** @type {import("prettier").Config} */
export default {
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	useTabs: true,
	trailingComma: "es5",
	plugins: ["prettier-plugin-astro"],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
