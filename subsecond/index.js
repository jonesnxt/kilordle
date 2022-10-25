import { diffLines } from 'diff';
import { writeFileSync } from 'fs';
import { readFiles } from 'node-dir';
import { format as prettierFormat } from 'prettier';
import prettierTypescript from 'prettier/parser-typescript.js';
import S from 'subsecond';

const TARGET_DIR = '../src';

const contents = [];

readFiles(
  TARGET_DIR,
  {
    match: /\.[jt]sx?$/,
    exclude: /^\./,
  },
  function (err, content, next) {
    if (err) throw err;
    contents.push(content);
    next();
  },
  function (err, files) {
    if (err) throw err;

    runSubsecond(
      Object.fromEntries(contents.map((content, i) => [files[i], content]))
    );
  }
);

function runSubsecond(files) {
  const filesCopy = JSON.parse(JSON.stringify(files));
  S.load(files);

  S('MemberExpression').each((expression) => {
    const [name, index] = expression.children().map((child) => child.text());
    const nameDotLength = `${name}.length`;
    if (!index.startsWith(nameDotLength)) return;

    expression.text(`${name}.at(${index.slice(nameDotLength.length)})`);
  });

  Object.entries(S.print()).forEach(([name, content]) => {
    // (optional), if you want nice formatting
    const formatted = prettierFormat(content, {
      parser: 'typescript',
      plugins: [prettierTypescript],
      printWidth: 80,
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      useTabs: false,
    });

    diffLines(filesCopy[name], formatted)
      .filter((line) => line.added || line.removed)
      .forEach((line) =>
        console.log(
          line.added ? '+ ' : '- ',
          line.value.slice(0, line.value.length - 1)
        )
      );

    // Uncomment the following line when you are ready to write the changes
    writeFileSync(name, formatted, 'utf8');
  });
}
