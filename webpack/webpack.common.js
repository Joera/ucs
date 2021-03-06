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
        // globalObject: `(typeof self !== "undefined" ? self : this)`
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks: "initial",
        },
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [ "style-loader","css-loader","sass-loader"],
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".jsx", ".scss", ".svg", ".css", ".json"],
        modules: ['node_modules'],
        fallback: {
            util: require.resolve("util/"),
            url: require.resolve("url/"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
            crypto: require.resolve("crypto-browserify"),
            timers: require.resolve("timers-browserify"),
            path: require.resolve("path-browserify"),
            zlib: require.resolve("browserify-zlib"),
            os: require.resolve("os-browserify/browser"),
            https: require.resolve("https-browserify"),
            http: require.resolve("http-stream"),
            buffer: require.resolve("buffer")

        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        })
    ],
};

