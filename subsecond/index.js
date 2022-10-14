import S from 'subsecond';
import { readFiles } from 'node-dir';
import { diffLines } from 'diff';
import { writeFileSync } from 'fs';
import { format as prettierFormat } from 'prettier';
import prettierTypescript from 'prettier/parser-typescript.js';

const TARGET_DIR = '../src';

const contents = [];

readFiles(
  TARGET_DIR,
  {
    match: /.(j|t)sx?$/,
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

  S('TaggedTemplateExpression')
    .filter((taggedTemplate) =>
      taggedTemplate.children('MemberExpression').text().includes('styled')
    )
    .each((taggedTemplate) => {
      console.log(taggedTemplate.children('TemplateLiteral').text());
    });

  Object.entries(S.print()).forEach(([name, content]) => {
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

    // writeFileSync(name, formatted, 'utf8');
  });
}
