import parse from "date-fns/parse";

import { MMOL_PER_L_TO_MG_PER_DL } from "../components/Graph/helpers";

// TODO: Currently GraphData is responsible for too much. It processes response data and holds the
// processed / partitioned data. The discrete graph data types (cbg, smbg, basal, etc) are kind of
// buried as anonymous objects instead of classes. Should refactor to have those be discrete
// classes (probably with common base) and have the processor be a separate class as well.

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

    this.cbgData = [];
    this.smbgData = [];
    this.basalData = [];
    this.bolusData = [];
    this.wizardData = [];
    this.maxBasalValue = 0;
    this.maxBolusValue = 0;
    this.maxRecommendedBolusValue = 0;

    this.splitAndTransformResponseDataByType();

    // console.log("sortAndDeduplicate cbgData");
    this.cbgData = this.sortAndDeduplicate(this.cbgData);

    // console.log("sortAndDeduplicate smbgData");
    this.smbgData = this.sortAndDeduplicate(this.smbgData);

    // console.log("sortAndDeduplicate basalData");
    this.basalData = this.sortAndDeduplicate(this.basalData);
    this.minBasalScaleValue = 1.0;
    this.maxBasalValue = Math.max(this.maxBasalValue, this.minBasalScaleValue);
    // console.log(`maxBasalValue: ${this.maxBasalValue}`);

    // console.log("sortAndDeduplicate bolusData");
    this.bolusData = this.sortAndDeduplicate(this.bolusData);
    this.minBolusScaleValue = 1.0;
    this.maxBolusValue = Math.max(this.maxBolusValue, this.minBolusScaleValue);
    // console.log(`maxBolusValue: ${this.maxBolusValue}`);
    // console.log(`bolusData: ${JSON.stringify(this.bolusData, null, 2)}`);

    // console.log("sortAndDeduplicate wizardData");
    this.wizardData = this.sortAndDeduplicate(this.wizardData);
    // console.log(`maxRecommendedBolusValue: ${this.maxRecommendedBolusValue}`);
    this.maxBolusValue = Math.max(
      this.maxBolusValue,
      this.maxRecommendedBolusValue
    );
    // console.log(`maxBolusValue: ${this.maxBolusValue}`);
    // console.log(`wizardData: ${JSON.stringify(this.wizardData, null, 2)}`);
  }

  //
  // Private
  //

  splitAndTransformResponseDataByType() {
    this.responseData.forEach(item => {
      switch (item.type) {
        case "cbg":
          this.cbgData.push(this.transformCbgResponseDataItem(item));
          break;
        case "smbg":
          this.smbgData.push(this.transformSmbgResponseDataItem(item));
          break;
        case "basal":
          {
            const transformedItem = this.transformBasalResponseDataItem(item);
            if (transformedItem) {
              this.basalData.push(transformedItem);
            }
          }
          break;
        case "bolus":
          this.bolusData.push(this.transformBolusResponseDataItem(item));
          break;
        case "wizard":
          this.wizardData.push(this.transformWizardResponseDataItem(item));
          break;
        case "food":
          {
            // NOTE: This is a quick and dirty way of adding food carb
            // visualization - turning a food sample into a wizard that has a
            // carb value but no associated bolus, allowing the graphing of
            // wizard carbs to be leveraged.
            const transformedItem = this.transformFoodResponseDataItem(item);
            if (transformedItem) {
              this.wizardData.push(transformedItem);
            }
          }
          break;
        default:
          break;
      }
    });

    // We're done with response data now
    this.responseData = null;
  }

  transformCbgResponseDataItem(item) {
    const time = parse(item.time).getTime() / 1000;
    const value = Math.round(item.value * MMOL_PER_L_TO_MG_PER_DL);
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
    const time = parse(item.time).getTime() / 1000;
    const value = Math.round(item.value * MMOL_PER_L_TO_MG_PER_DL);
    const isLow = value < this.lowBGBoundary;
    const isHigh = value > this.highBGBoundary;

    return {
      time,
      value,
      isLow,
      isHigh,
    };
  }

  transformBasalResponseDataItem(item) {
    let shouldAddItem = true;
    const time = parse(item.time).getTime() / 1000;
    const { rate, duration, deliveryType } = item;
    const suppressedRate = this.getSuppressedBasalRate(item);
    const transformedItem = {
      time,
      value: rate,
      deliveryType,
      suppressedRate,
    };

    if (deliveryType === "suspend") {
      // Sometimes "suspend" events have no rate or duration, use 0 instead
      if (rate === undefined || duration === undefined) {
        transformedItem.value = 0;
      }
    } else if (!duration) {
      // Except for "suspend" events, filter out items with no duration
      shouldAddItem = false;
    }

    if (shouldAddItem && transformedItem.value === undefined) {
      // Filter out items with no value (rate)
      shouldAddItem = false;
    }

    if (shouldAddItem) {
      if (transformedItem.value > this.maxBasalValue) {
        this.maxBasalValue = transformedItem.value;
      }

      return transformedItem;
    }

    return null;
  }

  transformBolusResponseDataItem(item) {
    const {
      id,
      normal,
      extended,
      duration,

      // For interrupted bolus, expectedNormal will exist
      expectedNormal,

      // For interrupted extended bolus, expectedExtended and expectedDuration will exist
      expectedExtended,
      expectedDuration,
    } = item;
    const time = parse(item.time).getTime() / 1000;
    let value = 0;
    if (normal) {
      value += normal;
    }
    if (extended) {
      value += extended;
    }

    let maxValue = value;
    if (expectedNormal > maxValue) {
      maxValue = expectedNormal;
    }
    if (maxValue > this.maxBolusValue) {
      this.maxBolusValue = maxValue;
    }

    const transformedItem = {
      id,
      time,
      value,
      normal,
      extended,
      duration: duration !== undefined ? duration / 1000 : undefined,
      expectedNormal,
      expectedExtended,
      expectedDuration:
        expectedDuration !== undefined ? expectedDuration / 1000 : undefined,
    };

    return transformedItem;
  }

  transformWizardResponseDataItem(item) {
    const { carbInput, recommended, bolus: bolusId } = item;
    const time = parse(item.time).getTime() / 1000;
    const value = carbInput || 0;
    const recommendedNet =
      recommended && recommended.net ? recommended.net : undefined;

    if (recommendedNet > this.maxRecommendedBolusValue) {
      this.maxRecommendedBolusValue = recommendedNet;
    }

    const transformedItem = {
      time,
      value,
      bolusId,
      recommendedNet,
    };

    return transformedItem;
  }

  /* eslint-disable class-methods-use-this */
  transformFoodResponseDataItem(item) {
    let transformedItem;

    const { nutrition: { carbohydrate: { net: value = {} } = {} } = {} } = item;
    if (value) {
      const time = parse(item.time).getTime() / 1000;
      transformedItem = {
        time,
        value,
      };
    }

    return transformedItem;
  }
  /* eslint-enable class-methods-use-this */

  getSuppressedBasalRate(item) {
    let suppressedRate = null;

    if (item.deliveryType === "temp") {
      const suppressedBasalItem = item.suppressed;
      if (suppressedBasalItem) {
        suppressedRate = this.getScheduledSuppressedRate(suppressedBasalItem);
      }
      if (suppressedRate === null) {
        // console.log(
        //   `getSuppressedBasalRate: No suppressed rate in temp basal!, item: ${JSON.stringify(
        //     item
        //   )}`
        // );
      }
    }

    return suppressedRate;
  }

  getScheduledSuppressedRate(item) {
    // Deal with nested suppressed arrays - need to march up them to find the innermost value. Data
    // may have a temp rate of 0, and multiple suppressions all at zero. Only innermost will have a
    // delivery type of 'scheduled'.
    const suppressedBasalItem = item.suppressed;
    if (item.deliveryType === "scheduled") {
      return item.rate;
    } else if (suppressedBasalItem) {
      return this.getScheduledSuppressedRate(suppressedBasalItem);
    }
    return null;
  }

  sortAndDeduplicate(data) {
    // console.log(`sortAndDeduplicate: data items: ${data.length}`);

    let processedData = data;

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
        if (value !== previousItem.value || time !== previousItem.time) {
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
      processedData = processedData.filter(item => {
        const { time } = item;
        return (
          Math.abs(this.eventTimeSeconds - time) <= this.timeIntervalSecondsHalf
        );
      });
      // console.log(
      //   `data items filtered by time interval: ${processedData.length}`
      // );
      // const firstItemTime = parse(data[0].time * 1000);
      // console.log(`first item time: ${firstItemTime}`);
      // const lastItemTime = parse(data[processedData.length - 1].time * 1000);
      // console.log(`last item time: ${lastItemTime}`);
      // const dataTimeSpanSeconds =
      //   lastItemTime.getTime() / 1000 - firstItemTime.getTime() / 1000;
      // console.log(
      //   `data time span seconds (hours): ${dataTimeSpanSeconds / 60 / 60}`
      // );
    }

    return processedData;
  }
}
