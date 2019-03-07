/* eslint import/no-extraneous-dependencies: 0 */

import initStoryshots, {
  multiSnapshotWithOptions,
} from "@storybook/addon-storyshots";

initStoryshots({
  test: multiSnapshotWithOptions({}),
});
