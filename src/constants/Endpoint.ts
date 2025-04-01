export const CLIENT_ORIGIN = (() => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SERVER_URL_2 || process.env.NEXT_PUBLIC_SERVER_URL;
  }

  return window.location.origin;
})();

const templates = `${CLIENT_ORIGIN}/templates`;

export const AP_END_POINTS = Object.freeze({
  ORDER: {
    INVOICE: `${templates}/order/invoice`,
    HISTORY: {
      PDF: `${templates}/order/orders`,
      XLXS: '/order/download'
    }
  },
  REPORT: {
    TRIAL_BALANCE: {
      PDF: `${templates}/report/trial-balance`,
      XLXS: ``
    },
    PNL: {
      PDF: `${templates}/report/pnl`,
      XLXS: ``
    },
    BALANCE_SHEET: {
      PDF: `${templates}/report/balance-sheet`,
      XLXS: ``
    },
    INVENTORY_COUNT: {
      PDF: `${templates}/report/inventory-count`,
      XLXS: ``
    },
    INVENTORY_PRICING: {
      PDF: `${templates}/maintenace/item-pricing`,
      XLXS: ``
    },
    INVENTORY_ITEM: {
      PDF: `${templates}/maintenace/item`,
      XLXS: ``
    },
    INVENTORY_VALUATION_DETAIL: {
      PDF: `${templates}/report/inventory-valuation-detail`,
      XLXS: ``
    },
    INVENTORY_VALUATION_SUMMARY: {
      PDF: `${templates}/report/inventory-valuation-summary`,
      XLXS: ``
    },
    STOCK_MOVEMENT_SUMMARY: {
      PDF: `${templates}/report/stock-movement-summary`,
      XLXS: ``
    },
    STOCK_MOVEMENT_DETAIL: {
      PDF: `${templates}/report/stock-movement-detail`,
      XLXS: ``
    },
    STOCK_ADJUSTMENT: {
      PDF: `${templates}/report/stock-adjustments`,
      XLXS: ``
    },
    STOCK_TRANSFER: {
      PDF: `${templates}/report/stock-transfer`,
      XLXS: ``
    },
    TRADE_PAYABLE: {
      PDF: `${templates}/report/trade-payable`,
      XLXS: ``
    },
    TRADE_RECEIVABLE: {
      PDF: `${templates}/report/trade-receivable`,
      XLXS: ``
    },
    PURCHASE: {
      PDF: `${templates}/purchase`,
      XLXS: ``
    },
    SUPPLIER: {
      PDF: `${templates}/suppliers`,
      XLXS: ``
    },
    CUSTOMER: {
      PDF: `${templates}/customer`,
      XLXS: ``
    }
  }
});
