#!/usr/bin/env node

// cspell:ignore CREATECOMMAND

import fs from "fs/promises";
import Path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { Command } from "commander";
import PackageJson from '../package.json' with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
	.name("create-lestin")
	.description("Create a new project with Lestin")
	.version(PackageJson.version, "-v, -V, --version", "create-lestin's version")
	.argument("<dir-name>", "Directory of the project")
	.option("-f, --force", "Force create a project in a non-empty directory")
	.option("-G, --no-git", "Don't initialize a git repository")
	.option("-i, --install", "Install dependencies after creating the project")
	.action(async (dirNameRaw) => {
		const options = program.opts();

		const dirName = Path.resolve(dirNameRaw);

		try {
			const doesDirExist = await fs.access(dirName);

			const isDirFull = (await fs.readdir(dirName)).length > 0;

			if (isDirFull) {
				console.error(
					"The directory is not empty. To force create a project in a non-empty directory, use the `--force` flag."
				);
				return;
			}
		} catch (error) {
			// console.error("The directory does not exist.");
			// return;
		}

		console.log("Creating project in the directory:", dirName, "\n");

		await fs.mkdir(dirName, {
			recursive: true,
		});

		await fs.cp(Path.resolve(__dirname, "../templates/hono-client-server"), dirName, {
			recursive: true,
		});

		const dirFiles = await fs.readdir(dirName, { recursive: true });

		dirFiles.forEach(async (file) => {
			const filePath = Path.resolve(dirName, file);
			if (filePath.endsWith("CREATECOMMAND")) {
				await fs.rename(filePath, filePath.replace("CREATECOMMAND", ""));
			}
		});

		if (!options.noGit) {
			console.log("Initializing git repository...");
			execSync("git init", {
				cwd: dirName,
				stdio: "inherit",
			});
		}

		if (options.install) {
			console.log("Installing dependencies...");
			execSync("yarn install", {
				cwd: dirName,
				stdio: "inherit",
			});
		}

		console.log("Project created successfully at the directory:", dirName, "\n");
		console.log("To start the project, run the following commands:\n");
		if (dirNameRaw !== ".") {
			console.log(`\tcd ${dirNameRaw}`);
		}
		console.log("\tyarn install");

		console.log("\nHappy coding!");
	});

program.parse(process.argv);
