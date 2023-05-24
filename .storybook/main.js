// .storybook/main.js
module.exports = {
  stories: [
    '../__stories__/components/*.stories.?(js)',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-controls'
  ],
};