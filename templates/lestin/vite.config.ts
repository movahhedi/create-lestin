import Crypto from "crypto";
import { defineConfig } from "vite";

// let cssModulesIndex = 0;

export default defineConfig({
	root: "src",
	publicDir: "../public",
	base: "",
	build: {
		minify: "terser",
		terserOptions: {
			format: {
				comments: false,
				shebang: true,
			},
			mangle: {
				properties: false,
			},
		},
		outDir: "../dist",
		rollupOptions: {
			input: {
				main: "src/index.html",
			},
		},
	},
	css: {
		devSourcemap: true,
		modules: {
			scopeBehaviour: "local",
			localsConvention: "camelCase",
			generateScopedName(name, fileName, css) {
				if (process.env.NODE_ENV === "production") {
					const isMinimum = true;

					if (isMinimum) {
						return "_" + cssModuleIdGenerator.next();
					}

					return (
						"_" +
						name.substring(0, 5) +
						Crypto.createHash("sha256")
							.update(name)
							.update(fileName)
							.update(css)
							.digest("base64url")
							.substring(0, 5)
					);

					/* cssModulesIndex++;
					return `_${cssModulesIndex}`; */
					/* const indexBase64 = Buffer.from("" + cssModulesIndex).toString(
						"base64url",
					);
					return `_${indexBase64}`; */
				}

				const componentName = fileName
					.replace(/\.module\.s?css/, "")
					.replace(/\.\w+$/, "")
					.replace(/\./, "")
					.split("/")
					.pop();

				const hash = Crypto.createHash("sha256")
					.update(css)
					.digest("base64url")
					.substring(0, 5);

				return `_${name}_${componentName}_${hash}`;
			},
		},
	},
	server: {
		hmr: true,
	},
});

class StringIdGenerator {
	_chars: string;
	_nextId: number[];

	constructor(chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
		this._chars = chars;
		this._nextId = [0];
	}

	next() {
		const r: string[] = [];
		for (const char of this._nextId) {
			r.unshift(this._chars[char]);
		}
		this._increment();
		return r.join("");
	}

	_increment() {
		for (let i = 0; i < this._nextId.length; i++) {
			const val = ++this._nextId[i];
			if (val >= this._chars.length) {
				this._nextId[i] = 0;
			} else {
				return;
			}
		}
		this._nextId.push(0);
	}

	*[Symbol.iterator]() {
		while (true) {
			yield this.next();
		}
	}
}

const cssModuleIdGenerator = new StringIdGenerator();
