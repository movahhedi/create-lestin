/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_IS_DEBUG_MODE: boolean;
	readonly VITE_IS_LOCAL_DEV_MODE: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
