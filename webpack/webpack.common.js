const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";
var glob = require("glob");

module.exports = {
    entry: glob
        .sync(path.join(__dirname, srcDir + "*.ts"))
        .reduce(function (obj, el) {
            obj[path.parse(el).name] = el;
            return obj;
        }, {}),
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
        // globalObject: `(typeof self !== 'undefined' ? self : this)`
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks: "initial",
        },
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            util: require.resolve("util/"),
            buffer: require.resolve("buffer/"),
            url: require.resolve("url/"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ],
};

