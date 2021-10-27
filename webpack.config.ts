import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import { Configuration, DefinePlugin } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SimpleProgressWebpackPlugin from 'simple-progress-webpack-plugin';

const buildMode =
  process.argv[3] == 'production' ? 'production' : 'development';
const isProductionBuild = buildMode === 'production';

type Optimization = Configuration['optimization'];
const optimization: Optimization = isProductionBuild
  ? {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            name: 'main',
            test: 'src/mythic.ts',
          },
          vendor: {
            name: 'vendor',
            test: /node_modules/,
          },
        },
      },
    }
  : undefined;

const config: Configuration = {
  context: __dirname,
  mode: buildMode,
  entry: {
    main: './src/mythic.ts',
    // tinymce: "./src/styles/tinymce.scss",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              experimentalWatchApi: !isProductionBuild,
              happyPackMode: true,
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        loader: 'thread-loader',
        options: {
          workers: os.cpus().length + 1,
          poolRespawn: false,
          poolTimeout: isProductionBuild ? 500 : Infinity,
        },
      },
    ],
  },
  optimization: optimization,
  devtool: isProductionBuild ? undefined : 'inline-source-map',
  bail: isProductionBuild,
  watch: !isProductionBuild,
  plugins: [
    new ForkTsCheckerWebpackPlugin({ typescript: { memoryLimit: 4096 } }),
    new DefinePlugin({
      BUILD_MODE: JSON.stringify(buildMode),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/', to: 'assets' },
        { from: 'src/fonts/', to: 'fonts' },
        { from: 'src/templates/', to: 'templates' },
        { from: 'src/system.json' },
        { from: 'src/template.json' },
        {
          from: 'src/lang/',
          to: 'lang',
          transform(content: Buffer, absoluteFrom: string) {
            if (path.basename(absoluteFrom) === 'en.json') {
              return JSON.stringify(JSON.parse(content.toString()));
            }
            return content;
          },
        },
      ],
    }),
    new MiniCssExtractPlugin({ filename: 'styles/[name].css' }),
    new SimpleProgressWebpackPlugin({
      format: isProductionBuild ? 'expanded' : 'compact',
    }),
  ],
  resolve: {
    alias: {
      '@actor': path.resolve(__dirname, 'src/module/actor'),
      '@item': path.resolve(__dirname, 'src/module/item'),
      '@module': path.resolve(__dirname, 'src/module'),
      '@scene': path.resolve(__dirname, 'src/module/scene'),
      '@scripts': path.resolve(__dirname, 'src/scripts'),
      '@system': path.resolve(__dirname, 'src/module/system'),
      '@util': path.resolve(__dirname, 'src/util'),
    },
    extensions: ['.ts'],
  },
  output: {
    clean: true,
    path: path.join(__dirname, 'dist/'),
    filename: '[name].bundle.js',
  },
};

export default config;
