
export const USER_ACCESS = {
    // WORKFLOW: {
    //   MODULE: 'workflow',
    //   ACTIONS: { VIEW_WORKFLOW: 'view-workflow', VIEW_MY_TASK: 'view-workflow' }
    // },
    CUSTOMER: {
        MODULE: 'customer',
        ACTIONS: { VIEW_CUSTOMERS: 'view', UPDATE_CUSTOMER: 'update', CREATE_CUSTOMER: 'create' }
    },
    SETTING: {
        MODULE: 'settings',
        ACTIONS: { VIEW_SETTINGS: 'view', UPDATE_SETTINGS: 'update' }
    },
    SUPPLIER: {
        MODULE: 'suppliers',
        ACTIONS: { VIEW_SUPPLIERS: 'view', UPDATE_SUPPLIER: 'update', CREATE_SUPPLIER: 'create' }
    },
    CATEGORY: {
        MODULE: 'category',
        ACTIONS: {
            VIEW_CATEGORIES: 'view',
            UPDATE_CATEGORY: 'update',
            CREATE_CATEGORY: 'create',
            DELETE_CATEGORY: 'delete'
        }
    },
    GROUP: {
        MDOULE: 'group',
        ACTIONS: {
            VIEW_GROUPS: 'view',
            UPDATE_GROUP: 'update',
            CREATE_GROUP: 'create',
            DELETE_GROUP: 'delete'
        }
    },
    DASHBOARD: {
        MODULE: 'dashboard',
        ACTIONS: { VIEW_DASHBOARD: 'view' }
    },
    SETUP: {
        MODULE: 'setup',
        ACTIONS: {
            VIEW_SETUP: 'view',
            VIEW_USER_ACCESS: 'view-user-access',
            VIEW_EMPLOYEES: 'view-employees',
            VIEW_DEPARTMENT: 'view-department',
            VIEW_ITEMS: 'view-items',
            VIEW_ITEM_CATEGORIES: 'view-item-categories',
            VIEW_ITEM_TYPES: 'view-item-types',
            VIEW_MASTER_DATA: 'view-master-data',
            VIEW_RATES: 'view-rates',
            VIEW_STORES: 'view-stores',
            VIEW_TAXATIONS: 'view-taxations',
            VIEW_WINWORD: 'view',
        }
    },
    ASSETS: {
        MODULE: 'assets',
        ACTIONS: {
            VIEW_ASSETS: 'view',
            CREATE_ASSET: 'create',
            UPDATE_ASSET: 'update',
            DELETE_ASSET: 'delete'
        }
    },
    FINANCE: {
        MODULE: 'finance',
        ACTIONS: {
            VIEW_FINANCE: 'view',
            VIEW_ACCOUNTS: 'view-accounts',
            NEW_ACCOUNT: 'new-account',
            UPDATE_ACCOUNT: 'update-account', // needed in backend
            VIEW_ACCOUNT_TYPE: 'view-account-type',
            NEW_ACCOUNT_TYPE: 'new-account-type',
            VIEW_CASHBOOK_ENTRIES: 'view-cashbook-entries',
            VIEW_JOURNAL_ENTRIES: 'view-journal-entries',
            NEW_JOURNAL: 'new-journal', // needed in backend
            VIEW_TRANSACTIONS: 'view-transactions',
            VIEW_PURCHASE_ENTRIES: 'view-purchase-entries',
            NEW_PURCHASE: 'new-purchase',
            VIEW_SALES_ENTRIES: 'view-sales-entries',
            NEW_SALES: 'new-sales',
            VIEW_PETTYCASH_ENTRIES: 'view-pettycash-entries',
            ADD_PETTYCASH: 'add-pettycash',
            VIEW_CONTRA_ENTRIES: 'view-contra-entries',
            NEW_CONTRA: 'new-contra',
            VIEW_PAYMENT_ENTRIES: 'view-payment-entries',
            NEW_PAYMENT: 'new-payment',
            VIEW_RECEIPT_ENTRIES: 'view-receipt-entries',
            NEW_RECEIPT: 'new-receipt',
            VIEW_NOTE_ENTRIES: 'view-note-entries', // needed in backend
            NEW_NOTE: 'new-note' // needed in backend
        }
    },
    WORKFLOW: {
        MODULE: 'workflow',
        ACTIONS: {
            VIEW_WORKFLOW: 'view-workflow',
            CREATE_WORKFLOW: 'create-workflow',
            UPDATE_WORKFLOW: 'update-workflow',
            DELETE_WORKFLOW: 'delete-workflow',
            VIEW_APPROVAL: 'view-approval',
            CREATE_APPROVAL: 'create-approval',
            UPDATE_APPROVAL: 'update-approval',
            DELETE_APPROVAL: 'delete-approval'
        }
    },
    REPORT: {
        MODULE: 'report',
        ACTIONS: {
            VIEW_REPORT: 'view',
            VIEW_TRIAL_BALANCE: 'view-trial-balance',
            VIEW_PROFIT_LOSS: 'view-profit-loss',
            VIEW_BALANCE_SHEET: 'view-balance-sheet'
        }
    },
    SALES: {
        MODULE: 'sales',
        ACTIONS: {
            VIEW_SALES: 'view',
            VIEW_QUOTATIONS: 'view-quotations',
            CREATE_QUOTATION: 'create-quotation',
            VIEW_ORDERS: 'view-orders',
            CREATE_ORDER: 'create-order',
            VIEW_INVOICES: 'view-invoices',
            CREATE_INVOICE: 'create-invoice'
        }
    },
    PURCHASE: {
        MODULE: 'purchase',
        ACTIONS: {
            VIEW_PURCHASE: 'view',
            VIEW_REQUISITIONS: 'view-requisitions',
            CREATE_REQUISITION: 'create-requisition',
            VIEW_ORDERS: 'view-orders',
            CREATE_ORDER: 'create-order',
            VIEW_INVOICES: 'view-invoices',
            CREATE_INVOICE: 'create-invoice'
        }
    },
    // needed in the backend
    COMPANY: {
        MODULE: 'company',
        ACTIONS: {
            VIEW_COMPANY: 'view',
            UPDATE_COMPANY: 'update'
        }
    },
    PROFILE: {
        MODULE: 'profile',
        ACTIONS: {
            VIEW_PROFILE: 'view',
            UPDATE_PROFILE: 'update',
            CONFIG: 'config'
        }
    },
    // needed in the backend
    INVOICE: {
        MODULE: 'invoice',
        ACTIONS: {
            VIEW_INVOICE: 'view',
            CREATE_INVOICE: 'create',
            UPDATE_INVOICE: 'update',
            DELETE_INVOICE: 'delete'
        }
    }
}