import moment from 'moment';
import _ from 'lodash';

const chatLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export interface IData {
  label: string;
  value: string;
  [key: string]: any;
}

export interface IEntry {
  date: string | number;
  value: number;
  //   [key: string]: any;
}

export interface IChartDuration {
  label: CHART_DURATION;
  unit: string;
  value: number;
}

export const CHART_DURATIONS: IChartDuration[] = [
  { label: 'TODAY', unit: 'days', value: 0 },
  { label: '1W', unit: 'days', value: 7 },
  { label: '1M', unit: 'month', value: 1 },
  { label: '3M', unit: 'month', value: 3 },
  { label: '6M', unit: 'month', value: 6 },
  {
    label: 'This Year',
    unit: 'year',
    value: moment().diff(moment().startOf('year'), 'month')
  }
];

export type CHART_DURATION = 'TODAY' | '1W' | '1M' | '3M' | '6M' | 'This Year';

export class ChartAggregateService {
  public static aggregateChartData(duration: CHART_DURATION, data: any) {
    switch (duration) {
      case 'TODAY':
        return ChartAggregateService.aggregateDataByHrs(data);
      case '1W':
        return ChartAggregateService.aggregateDataByDays(data);
      case '1M':
        return ChartAggregateService.aggregateDataByInterval(data, 3);
      case '3M':
        return ChartAggregateService.aggregateDataByMonth(data);
      case '6M':
        return ChartAggregateService.aggregateDataByMonth(data);
      case 'This Year':
        return ChartAggregateService.aggregateDataByMonth(data);
    }
  }

  public static getFromAndToDate(duration: IChartDuration): {
    fromDate: number;
    toDate: number;
  } {
    const currentDate = moment().valueOf();
    
    if (duration.label === 'TODAY') {
      return {
        fromDate: moment().startOf('day').valueOf(),
        toDate: currentDate
      };
    }

    if (duration.label === 'This Year') {
      return {
        fromDate: moment().startOf('year').valueOf(),
        toDate: currentDate
      };
    }


    return {
      fromDate: moment()
        .add(-duration.value, duration.unit as any)
        .valueOf(),
      toDate: currentDate
    };
  }

  private static aggregateDataByMonth(data: IEntry[]): any {
    const aggregated: IData = {} as IData;
    data.forEach((entry: IEntry) => {
      const date = new Date(+entry.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key: string = `${year}-${month}`;
      if (!aggregated[key]) {
        aggregated[key] = {
          label: chatLabels[month],
          value: entry.value // You might aggregate values (e.g., sum) here
        };
      } else {
        aggregated[key].value += entry.value; // Adjust aggregation method as needed
      }
    });
    return Object.values(aggregated);
  }

  private static aggregateDataByDays(data: IEntry[]) {
    const aggregatedData: IData = {} as IData;
    data.forEach((item: IEntry) => {
      const date = moment(+item.date).format('YYYY-MM-DD');
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          label: moment(+item.date).format('DD'),
          value: item.value
        };
      } else {
        aggregatedData[date].value += item.value;
      }
    });

    return Object.values(aggregatedData);
  }

  private static aggregateDataByHrs(data: IEntry[]) {
    const aggregatedData: IData = {} as IData;
    data.forEach((item: IEntry) => {
      const date = moment(+item.date).format('hh');
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          label: moment(+item.date).format('hh'),
          value: item.value
        };
      } else {
        aggregatedData[date].value += item.value;
      }
    });

    return Object.values(aggregatedData);
  }

  public static aggregateDataByInterval(data: IEntry[], intervalDays: number) {
    const aggregatedData: IData[] = [];
    const groupedData: IData = {} as IData;
    data.forEach((item: IEntry) => {
      const timestamp = new Date(+item.date);
      const intervalIndex = Math.floor(timestamp.getTime() / (intervalDays * 24 * 60 * 60 * 1000));
      const intervalStart = new Date(intervalIndex * intervalDays * 24 * 60 * 60 * 1000);
      const intervalStr = moment(intervalStart).format('MM-DD-YY');
      if (!groupedData[intervalStr]) {
        groupedData[intervalStr] = [];
      }
      groupedData[intervalStr].push(item);
    });

    Object.keys(groupedData).forEach((key) => {
      const sum = groupedData[key]
        .map((d: IData) => d.value)
        .reduce((acc: any, curr: any) => acc + curr, 0); //
      aggregatedData.push({
        label: moment(+groupedData[key][groupedData[key]?.length - 1].date).format('DD'),
        value: sum
      });
    });

    return aggregatedData;
  }

  public static chooseInterval(startDate: number, endDate: number) {
    const diffInDays = moment(endDate).diff(moment(startDate), 'days');

    if (diffInDays <= 7) return 'hour'; // If range is within a week
    if (diffInDays <= 30) return 'day'; // If range is within a month
    if (diffInDays <= 90) return 'week'; // If range is within 3 months
    return 'month'; // Longer ranges
  }

  public static formatInterval(interval: string) {
    switch (interval) {
      case 'hour':
        return 'hh';
      case 'day':
        return 'DD';
      case 'week':
        return 'ww';
      case 'month':
        return 'MMM';

      default:
        break;
    }
  }

  public static aggregateData(data: IEntry[]): IData[] {
    if (data?.length === 0) return [];

    const interval = ChartAggregateService.chooseInterval(
      data[0].date as number,
      data[data.length - 1].date as number
    );

    return _.chain(data)
      .groupBy((item: IEntry) => moment(item.date).startOf(interval).format()) // Group by time interval
      .map((items: IEntry[], key: string) => ({
        label: moment(key).format(ChartAggregateService.formatInterval(interval)), // Example label
        value: _.sumBy(items, 'value').toString(), // Example aggregation (sum) as string
        count: items.length, // Number of items in the group
        average: _.meanBy(items, 'value') // Example aggregation (average)
      }))
      .value();
  }
}
