import { rmSync } from "fs";
import { join } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import pkg from "./package.json";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from 'path';
rmSync("dist", { recursive: true, force: true }); // v14.14.0
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    plugins: [
        AutoImport({
        /* options */
        }),
        Components({
        /* options */
        }),
        vue(),
        electron({
            main: {
                entry: "electron/main/index.ts",
                vite: withDebug({
                    build: {
                        outDir: "dist/electron/main",
                    },
                }),
            },
            preload: {
                input: {
                    // You can configure multiple preload here
                    index: join(__dirname, "electron/preload/index.ts"),
                },
                vite: {
                    build: {
                        // For Debug
                        sourcemap: "inline",
                        outDir: "dist/electron/preload",
                    },
                },
            },
            // Enables use of Node.js API in the Renderer-process
            renderer: {},
        }),
    ],
    server: {
        host: pkg.env.VITE_DEV_SERVER_HOST,
        port: pkg.env.VITE_DEV_SERVER_PORT,
    },
});
function withDebug(config) {
    if (process.env.VSCODE_DEBUG) {
        if (!config.build)
            config.build = {};
        config.build.sourcemap = true;
        config.plugins = (config.plugins || []).concat({
            name: "electron-vite-debug",
            configResolved(config) {
                const index = config.plugins.findIndex((p) => p.name === "electron-main-watcher");
                // At present, Vite can only modify plugins in configResolved hook.
                config.plugins.splice(index, 1);
            },
        });
    }
    return config;
}
//# sourceMappingURL=vite.config.js.map