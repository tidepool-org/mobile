import { getStorybookUI, configure } from "@storybook/react-native";
import { loadStories } from "./storyLoader";
import "./addons";

// import stories
configure(() => {
  loadStories();
}, module);

const StorybookUI = getStorybookUI();
export default StorybookUI;
