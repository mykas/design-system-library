import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import packageJson from '../package.json';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: `@wix/__library-name__ ${packageJson.version}`,
    brandUrl: 'https://github.com/wix-private/wix-design-systems/blob/master/packages/__library-name__',
  }),
});
