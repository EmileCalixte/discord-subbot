import * as path from "path";
import NodemonPlugin from "nodemon-webpack-plugin";

const config = {
    entry: "./src/index.ts",
    target: "node",
    output: {
        filename: "main.cjs",
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
        new NodemonPlugin(),
    ],
};

export default config;
