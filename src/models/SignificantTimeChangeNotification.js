import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

class SignificantTimeChangeNotification {
  constructor() {
    this.observers = [];

    this.date = new Date();
    setInterval(() => {
      const date = new Date();
      if (
        Math.abs(differenceInCalendarDays(this.date, date)) > 0 ||
        Math.abs(differenceInMinutes(this.date, date)) > 30
      ) {
        // console.log("significant time change");
        this.notify();
      } else {
        // console.log("not a significant time change");
      }
      this.date = date;
    }, 1000 * 30); // 30 seconds
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(
      subscriber => subscriber !== observer
    );
  }

  notify() {
    this.observers.forEach(observer => observer());
  }
}

export default new SignificantTimeChangeNotification();
