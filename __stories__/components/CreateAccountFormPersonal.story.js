import React from "react";
import { storiesOf } from "@storybook/react-native";
import {
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { Formik } from "formik";

import StoryContainerComponent from "../utils/StoryContainerComponent";

const styles = StyleSheet.create({
  input: {
    borderColor: "#DCE0F9",
    borderWidth: 5,
  },
});

storiesOf("CreateAccountFormPersonal", module).add("default", () => (
  <StoryContainerComponent>
    <Formik
      initialValues={{ name: "" }}
    >
      {formikProps => (
        <React.Fragment>
          <TextInput
            style={styles.input}
            onChangeText={formikProps.handleChange("name")}
          />
          <Button title="Submit" onPress={formikProps.handleSubmit} />
        </React.Fragment>
      )}
    </Formik>
  </StoryContainerComponent>
));
