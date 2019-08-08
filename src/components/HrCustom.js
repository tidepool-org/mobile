import React, { PureComponent } from "react";
import { StyleSheet} from "react-native";
import Hr from "react-native-hr-component";

const styles = StyleSheet.create({
  hr: {
    paddingTop: 32,
    paddingBottom: 32,
  },
});

class HrCustom extends PureComponent {

  render() {
    return (
      <Hr lineColor='#ececed' width={1} text="" textPadding={0} hrStyles={styles.hr} />
    );
  }
}

export { HrCustom };
