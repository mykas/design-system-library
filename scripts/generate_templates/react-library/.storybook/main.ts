const path = require('path');
const { default: getStyleLoaders } = require('@wix/yoshi-webpack-utils/build/getStyleLoaders');
const { StylableWebpackPlugin } = require('@stylable/webpack-plugin');
const WixStorybookWebpackPlugin = require('wix-storybook-utils/WixStorybookWebpackPlugin');
const webpack = require('webpack');

module.exports = {
  stories: ['../src/**/*.story.ts*'],
  addons: [],
  logLevel: 'debug',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config: any) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        buffer: 'buffer',
        net: false,
        tls: false,
        path: false,
        assert: false,
        url: false,
        os: false,
        stream: false,
      },
    };

    config.module.rules = config.module.rules.filter(
      ({ test }: any) => test.toString() !== '/\\.css$/',
    );

    config.module.rules.unshift(
      ...getStyleLoaders({
        name: 'storybook',
        embedCss: true,
      }),
    );

    config.plugins = [
      ...(config.plugins ?? []),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
      new StylableWebpackPlugin(),
      new WixStorybookWebpackPlugin({
        moduleName: '@wix/__library-name__',
        repoBaseURL:
          'https://github.com/wix-private/wix-design-systems-utils/tree/master/packages/__library-name__',
        issueURL:
          'https://github.com/wix-private/wix-design-systems-utils/issues/new/choose',
        importFormat: "import { %componentName } from '%moduleName'",
        importTestkitPath: '@wix/__library-name__/testkit',
        testkits: {
          vanilla: {
            template: `import { <%= component.displayName %>Testkit } from '@wix/__library-name__/jsdom-react';`,
          },
        },
        parserOptions: {
          skipPropsWithoutDoc: true,
        },
        playgroundComponentsPath: path.resolve(__dirname, './playground'),
        unifiedTestkit: true,
        feedbackText: `You can help us improve this component by providing feedback,
      asking questions or leaving any other comments via <a href="~~ your slack channel ~~" target="_blank">~~ your slack channel name ~~</a> slack channel or GitHub.
      Found a bug? Please <a href="~~ your issue submitting platform ~~" target="_blank">submit an issue</a>.`,
      }),
    ];

    return config;
  },
};
