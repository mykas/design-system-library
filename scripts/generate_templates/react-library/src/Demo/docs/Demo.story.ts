import Demo from '../Demo';
import content from './Demo.content';
import demo from './Demo.demo';
import * as examples from './Demo.examples';

export default {
  category: 'Demo',
  component: Demo,
  storyName: 'Demo',
  componentPath: '../Demo.tsx',
  exampleImport: "import { Demo } from '@wix/__library-name__';",
  story: {
    content,
    demo,
    examples,
  },
};
