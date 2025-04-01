import { DEFAULT_PAGE_SIZE } from './constants';
import { ToWords } from 'to-words';

const helper = {
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },
  isWithinRange: (range: any, num: number) => {
    if (range.minQuantity <= num && range.maxQuantity >= num) {
      return true;
    }
  },

  shortName: (val: any) => {
    if (!val || val.length == 0) return '';

    const splt = val.split(' ');
    return `${splt[0][0]}${splt.length > 1 ? splt[1][0] || '' : ''}`;
  },
  isEmptyObj: (obj: any) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  },

  logger: {
    info: (...args: any) => {
      console.log(JSON.stringify(args, getCircularReplacer(), 4), 'info logs');
    },
    error: (...args: any) => {
      console.log(JSON.stringify(args, getCircularReplacer(), 4), 'error log');
    }
  },
  toReadableNumber(val: number): string {
    return helper.toCurrency(val, { currency: '' }).replace('.00', '');
  },
  debounce: <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    }) as T;
  },
  toCurrency: (val: number | string, format?: { currency?: string; precision?: number }) => {
    const { currency = 'RM ', precision = 2 } = format || {};

    val = precision ? helper.formatAmt(val, precision) : val;

    if (!val) return `${currency} 0.0`;
    return currency + (val as number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },
  formatAmt: (amt: number | string, precision = 2) => {
    if (typeof amt !== 'number' && typeof amt !== 'string') {
      return parseFloat('0.00');
    }

    let amtFloat = parseFloat(amt as any);
    if (isNaN(amtFloat)) {
      return parseFloat('0.00');
    }

    // Format the amount to the specified precision
    let formattedAmt = amtFloat.toFixed(precision);

    return parseFloat(formattedAmt);
  },
  amountInWords: (amount: number) => {

    if (isNaN(amount)) {
      return ""
    }

    return new ToWords({
      localeCode: "en-US",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: 'MYR',
          plural: 'MYR',
          symbol: 'MYR',
          fractionalUnit: {
            name: 'Paisa',
            plural: 'Paise',
            symbol: '',
          },
        },
      },
    })?.convert(amount);
  },
  getCookie(cname: string, cookieStr: string) {
    if (!cookieStr) {
      return '';
    }

    let name = cname + '=';
    let ca = cookieStr?.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },
  getHostFromUrl(url: string) {
    let host = url.split('/')[2];
    return host;
  }
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const mapPageFilter = (filter: any) => {
  let payload: any = {
    ...filter,
    skip: filter?.page
      ? filter?.page === 1 || filter?.page <= 0
        ? 0
        : (filter?.page - 1) * filter.pageSize
      : +filter?.skip || 0,
    take: filter?.pageSize || +filter?.take || DEFAULT_PAGE_SIZE
  };

  if (payload?.fromDate) {
    payload.fromDate = +payload.fromDate;
  }

  if (payload?.toDate) {
    payload.toDate = +payload.toDate;
  }

  delete payload.page;
  delete payload.pageSize;
  return payload;
};


export const mapTemplateDownloadQuery = (query: any) => {

  const filter = { ...query };

  if (filter?.fromDate) {
    filter.fromDate = +filter.fromDate;
  }

  if (filter?.toDate) {
    filter.toDate = +filter.toDate;
  }

  if (filter?.take) {
    filter.skip = 0;
    filter.take = +filter.take;
  }

  delete filter.serverAddress;

  delete filter.accessToken;

  delete filter.apiEndpoint;

  delete filter.companyId;

  delete filter.entryType;

  delete filter.page;

  delete filter.pageSize;

  delete filter.downloadType;

  return filter;
}

export default helper;
