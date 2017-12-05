import React from "react";
import { storiesOf } from "@storybook/react-native";
import glamorous from "glamorous-native";

import { StoryContainerComponent } from "../../__stories__/utils/StoryContainer";
import HashtagText from "../../src/components/HashtagText";
import Colors from "../../src/constants/Colors";
import FontStyles from "../../src/constants/FontStyles";

const text1 = "#hash1 This some text with hash tags #hash2";
const text2 =
  "This is some more text with hash tags. This note is longer. It should be multi-line. See how long this note is? #multiline";

storiesOf("HashtagText", module).add("default", () => (
  <StoryContainerComponent>
    <glamorous.View>
      <glamorous.Text>
        <HashtagText
          boldStyle={{
            color: Colors.blackish,
            ...FontStyles.mediumSmallBoldFont,
          }}
          normalStyle={{
            color: Colors.blackish,
            ...FontStyles.mediumSmallRegularFont,
          }}
          text={text1}
        />
      </glamorous.Text>
      <glamorous.Text marginTop={10}>
        <HashtagText
          boldStyle={{
            color: Colors.blackish,
            ...FontStyles.mediumSmallBoldFont,
          }}
          normalStyle={{
            color: Colors.blackish,
            ...FontStyles.mediumSmallRegularFont,
          }}
          text={text2}
        />
      </glamorous.Text>
    </glamorous.View>
  </StoryContainerComponent>
));
