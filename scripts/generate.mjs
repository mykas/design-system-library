import util from 'util';
import path from 'path';
import fs from 'fs/promises';
import url from 'url';
import readline from 'readline';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = util.promisify(rl.question).bind(rl);

//  Check templates
const templates = await fs.readdir(path.resolve(__dirname, './generate_templates'));
const args = process.argv.slice(2);
const type = args[0];

if (!templates.includes(type)) {
  console.error('wrong params');
  process.exit(0);
}

// Get new library name
const libraryName = await question('Library name: ');

// Copy the right template
await fs.cp(
  path.resolve(__dirname, `./generate_templates/${type}`),
  path.resolve(__dirname, `../packages/${libraryName}`),
  { recursive: true }
);

// Set the library name
async function setName(node) {
  const isDirectory = (await fs.stat(node)).isDirectory();
  if (isDirectory) {
    const directory = await fs.readdir(node);
    for await (const file of directory) {
      await setName(`${node}/${file}`);
    }
  } else {
    const fileData = await fs.readFile(node, { encoding: 'utf-8' });
    const result = fileData.replace(/__library-name__/g, libraryName);
    await fs.writeFile(node, result);
  }
}

const root = path.resolve(__dirname, `../packages/${libraryName}`);
await setName(root);

// Update the main README.md
await fs.appendFile(path.resolve(__dirname, '../README.md'), `
### [${libraryName}](https://github.com/wix-private/wix-design-systems-utils/blob/master/packages/${libraryName}/README.md)
~~ Your description here ~~
`);

// Add shortcut to main scripts
const json = JSON.parse(await fs.readFile('package.json'));
const _scripts = json.scripts;
json.scripts = {};
for (let x in _scripts) {
  if (x.includes('Generator')) {
    json.scripts[libraryName] = `yarn workspace @wix/${libraryName} $0`;
  }
  json.scripts[x] = _scripts[x];
}
await fs.writeFile('package.json', JSON.stringify(json, null, 2));

// Done
console.log(`\nLibrary ${libraryName} generated!`);
rl.close();
process.exit(0);
