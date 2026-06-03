const joinFiles = (files) => files.map((file) => `"${file}"`).join(' ');

module.exports = {
  '*.{ts,js,mjs,cjs,mts,astro,svelte,vue,tsx}': (stagedFiles) => {
    const files = joinFiles(stagedFiles);
    return [`prettier --write ${files}`, `eslint --max-warnings=0 --no-warn-ignored ${files}`];
  },
  '*.{md,css}': (stagedFiles) => [`prettier --write ${joinFiles(stagedFiles)}`],
};
