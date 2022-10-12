import S from 'subsecond';
import { readFiles } from 'node-dir';
import { diffLines } from 'diff';
import { writeFileSync } from 'fs';

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

  S('JSXOpeningElement').each((openingTag) => {
    const attributes = openingTag.children('JSXAttribute');

    const sortedAttributes = attributes
      .map((attribute) => attribute.text())
      .sort();

    attributes.each((attribute, i) => attribute.text(sortedAttributes[i]));
  });

  // its that easy...
  Object.entries(S.print()).forEach(([name, content]) => {
    writeFileSync(name, content, 'utf8');
  });

  Object.entries(S.print()).forEach(([name, content]) => {
    diffLines(filesCopy[name], content)
      .filter((line) => line.added || line.removed)
      .forEach((line) =>
        console.log(
          line.added ? '+ ' : '- ',
          line.value.slice(0, line.value.length - 1)
        )
      );
  });
}
