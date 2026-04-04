module.exports = {
  types: [
    { type: 'feat', section: 'Added' },
    { type: 'fix', section: 'Fixed' },
    { type: 'perf', section: 'Changed' },
    { type: 'refactor', section: 'Changed' },
    { type: 'revert', section: 'Removed' },
    { type: 'docs', hidden: true },
    { type: 'style', hidden: true },
    { type: 'chore', hidden: true },
    { type: 'test', hidden: true },
    { type: 'build', hidden: true },
    { type: 'ci', hidden: true },
  ],
  commitUrlFormat:
    'https://github.com/muratcakmak/expo-ai-elements/commit/{{hash}}',
  compareUrlFormat:
    'https://github.com/muratcakmak/expo-ai-elements/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat:
    'https://github.com/muratcakmak/expo-ai-elements/issues/{{id}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  tagPrefix: 'v',
  packageFiles: ['package.json'],
  bumpFiles: ['package.json'],
};
