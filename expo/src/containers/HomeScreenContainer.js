import { connect } from "react-redux";

import HomeScreen from "../screens/HomeScreen";

// TODO: notes - get this from redux state
const eventListData = [
  {
    id: "1",
    time: "December 2, 7:00 pm",
    text: "Note text #testing #sitechange",
  },
  {
    id: "2",
    time: "October 26, 2:00 pm",
    text: "#meal Note text 2",
  },
  {
    id: "3",
    time: "July 10, 12:00 pm",
    text: "#exercise #meal Note text 3",
  },
];

const mapStateToProps = state => ({
  eventListData,
});

export default connect(mapStateToProps)(HomeScreen);
