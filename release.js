module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "docs", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "chore", release: "patch" },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "chore", section: "Chore" },
            { type: "docs", section: "Documentation" },
            { type: "style", section: "Style" },
            { type: "refactor", section: "Refactor" },
            { type: "perf", section: "Performance" },
            { type: "test", section: "Test" },
          ],
        },
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
      },
    ],
    "@semantic-release/github",
  ],
};
