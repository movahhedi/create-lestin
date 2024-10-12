import { defineFlatConfig } from "eslint-define-config";
// import perfectionist from "eslint-plugin-perfectionist";
import MovahhediConfig from "@movahhedi/eslint-config";

//#region eslint config
export default defineFlatConfig([
	...MovahhediConfig({
		tsconfig: "./tsconfig.eslint.json",
	}),
]);
//#endregion
