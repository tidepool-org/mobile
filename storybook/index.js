import { getStorybookUI, configure } from "@storybook/react-native";
import { loadStories } from "./storyLoader";

// import stories
configure(() => {
  loadStories();
}, module);

const StorybookUI = getStorybookUI();
export default StorybookUI;
