import * as path from "path";
import NodemonPlugin from "nodemon-webpack-plugin";

const config = {
    entry: {
        main: "./src/index.ts",
        "register-commands": "./src/register-commands.ts",
    },
    target: "node",
    output: {
        filename: "[name].cjs",
        path: path.resolve(path.dirname("."), "dist"),
        clean: true, // Delete old files before creating new ones
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new NodemonPlugin({
            script: "dist/main.cjs",
        }),
    ],
};

export default config;
