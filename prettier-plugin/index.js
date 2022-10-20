const { parsers: typescriptParsers } = require('prettier/parser-typescript');
const { parsers: javascriptParsers } = require('prettier/parser-babel');
const S = require('subsecond');

function preprocess(text, opts) {
  S.load({ 'index.tsx': text });

  S('Program').each((file) => {
    const imports = file
      .children('ImportDeclaration')
      .map((imp) => ({
        text: imp.text(),
        hasNamedImports: imp.children().length !== 1,
        packageName: imp.children('Literal').text(),
      }))
      .sort((a, b) => (a.packageName > b.packageName ? -1 : 1));

    file.children('ImportDeclaration').text('');

    const firstElement = file.children().eq(0);

    firstElement.before('\n');

    // local imports
    imports
      .filter((imp) => imp.hasNamedImports && imp.packageName[1] === '.')
      .forEach((imp) => firstElement.before(imp.text + '\n'));

    firstElement.before('\n');

    // node_modules imports
    imports
      .filter((imp) => imp.hasNamedImports && imp.packageName[1] !== '.')
      .forEach((imp) => firstElement.before(imp.text + '\n'));

    firstElement.before('\n');

    // no named imports, like import 'style.css';
    imports
      .filter((imp) => !imp.hasNamedImports)
      .forEach((imp) => firstElement.before(imp.text + '\n'));
  });

  return S.print()['index.tsx'];
}

module.exports = {
  parsers: {
    typescript: {
      ...typescriptParsers.typescript,
      preprocess,
    },
    babel: {
      ...javascriptParsers.babel,
      preprocess,
    },
  },
};
