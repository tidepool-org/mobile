export default class GraphData {
  responseData = [];

  addResponseData(responseData) {
    this.responseData = [...this.responseData, ...responseData];
  }

  process({
    eventTimeSeconds,
    timeIntervalSeconds,
    lowBGBoundary,
    highBGBoundary,
  }) {
    // console.log(
    //   `responseData length: ${
    //     this.responseData.length
    //   }, timeIntervalSeconds (hours): ${timeIntervalSeconds / 60 / 60}`
    // );

    this.eventTimeSeconds = eventTimeSeconds;
    this.timeIntervalSecondsHalf = timeIntervalSeconds / 2;
    this.lowBGBoundary = lowBGBoundary;
    this.highBGBoundary = highBGBoundary;

    this.splitAndTransformResponseDataByType();

    // console.log("process cbgData");
    this.cbgData = this.processBgData(this.cbgData);

    // console.log("process smbgData");
    this.smbgData = this.processBgData(this.smbgData);
  }

  //
  // Private
  //

  splitAndTransformResponseDataByType() {
    this.cbgData = [];
    this.smbgData = [];

    this.responseData.forEach(item => {
      switch (item.type) {
        case "cbg":
          this.cbgData.push(this.transformCbgResponseDataItem(item));
          break;
        case "smbg":
          this.smbgData.push(this.transformSmbgResponseDataItem(item));
          break;
        default:
          break;
      }
    });

    // We're done with response data now
    this.responseData = null;
  }

  transformCbgResponseDataItem(item) {
    const time = new Date(item.time).getTime() / 1000;
    const glucoseConversionToMgDl = 18.0;
    const value = Math.round(item.value * glucoseConversionToMgDl);
    const isLow = value < this.lowBGBoundary;
    const isHigh = value > this.highBGBoundary;

    return {
      time,
      value,
      isLow,
      isHigh,
    };
  }

  transformSmbgResponseDataItem(item) {
    const time = new Date(item.time).getTime() / 1000;
    const glucoseConversionToMgDl = 18.0;
    const value = Math.round(item.value * glucoseConversionToMgDl);
    const isLow = value < this.lowBGBoundary;
    const isHigh = value > this.highBGBoundary;

    return {
      time,
      value,
      isLow,
      isHigh,
    };
  }

  processBgData(data) {
    let processedData = data;

    // console.log(`data items: ${data.length}`);

    if (processedData.length > 0) {
      processedData.sort((a, b) => {
        if (a.time < b.time) {
          return -1;
        } else if (a.time > b.time) {
          return 1;
        } else if (a.value < b.value) {
          return -1;
        } else if (a.value > b.value) {
          return 1;
        }
        return 0;
      });
      let previousItem = data[0];
      const dataWithoutDuplicates = [previousItem];
      for (let i = 1; i < processedData.length; i += 1) {
        const { value, time } = data[i];
        if (value !== previousItem.value && time !== previousItem.time) {
          dataWithoutDuplicates.push(data[i]);
        }
        previousItem = data[i];
      }
      processedData = dataWithoutDuplicates;
      // console.log(
      //   `data items without duplicates (by time and value): ${
      //     processedData.length
      //   }`
      // );
      processedData = processedData.filter(sample => {
        const { time } = sample;
        return (
          Math.abs(this.eventTimeSeconds - time) <= this.timeIntervalSecondsHalf
        );
      });
      // console.log(
      //   `data items filtered by time interval: ${processedData.length}`
      // );
      // const firstSampleTime = new Date(data[0].time * 1000);
      // console.log(`first sample time: ${firstSampleTime}`);
      // const lastSampleTime = new Date(data[processedData.length - 1].time * 1000);
      // console.log(`last sample time: ${lastSampleTime}`);
      // const cbgSampleTimeSpanSeconds =
      //   lastSampleTime.getTime() / 1000 - firstSampleTime.getTime() / 1000;
      // console.log(
      //   `data time span seconds (hours): ${cbgSampleTimeSpanSeconds /
      //     60 /
      //     60}`
      // );
    }

    return processedData;
  }
}
