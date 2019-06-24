import ConnectionStatus from "./ConnectionStatus";
import api from "../api";

class Metrics {
  constructor() {
    this.queue = [];
    this.isSendInProgress = false;
  }

  track({ metric, shouldFlushBuffer }) {
    this.addMetricToQueue(metric);

    if (this.shouldProcessNextMetric({ shouldFlushBuffer })) {
      this.processNextMetric({ shouldFlushBuffer });
    }
  }

  // Private

  addMetricToQueue(metric) {
    this.queue.push(metric);
  }

  shouldProcessNextMetric({ shouldFlushBuffer }) {
    let shouldProcess = true;

    if (ConnectionStatus.isOffline || !api().sessionToken) {
      shouldProcess = false;
    } else if (this.isSendInProgress && !shouldFlushBuffer) {
      // console.log(
      //   `isSendInProgress: ${isSendInProgress}, flush: ${shouldFlushBuffer}`
      // );
      shouldProcess = false;
    }

    return shouldProcess;
  }

  processNextMetric({ shouldFlushBuffer }) {
    const metric = this.queue.shift();

    if (metric) {
      // console.log(`processNextMetric: ${metric}`);

      api()
        .trackMetric({
          metric,
        })
        .then(() => {
          if (this.shouldProcessNextMetric({ shouldFlushBuffer })) {
            this.processNextMetric({ shouldFlushBuffer });
          }
        })
        .catch((/* error */) => {
          // console.log(`metrics error, metric: ${metric}, error: ${error}`);
        });
    }
  }
}

export default new Metrics();
