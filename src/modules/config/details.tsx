import { Form, Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import {
  ApButton,
  ApForm,
  ApLookupInput,
  ApPageFooter,
  ApText,
  ApTextInput
} from '../../components';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { useConfigState } from './context';
import { IConfig } from './model';

const FormSchema = Yup.object().shape({});

interface IProps {
  config: IConfig;
}
export const ConfigDetail: React.FC<IProps> = ({ config }) => {
  const { updateConfig, updateLoading } = useConfigState();


  const accountColumns = [
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber'
    }
  ];

  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }
  ];


  const handleSubmit = (values: any, actions: any) => {
    const payload = { ...values };

    delete payload.defaultStore;

    delete payload.defaultSalesCashAcount;
    delete payload.defaultSalesTransferAcount;

    delete payload.defaultPurchaseCashAcount;
    delete payload.defaultPurchaseTransferAcount;

    delete payload.defaultSalesReturnValueAcount;
    delete payload.defaultPurchaseReturnValueAcount;

    delete payload.defaultPurchaseReturnValueAcount;

    // finance
    delete payload.pettyCashAccount;
    delete payload.debtorsAccountType;
    delete payload.creditorsAccountType;
    delete payload.salaryAccountType;
    delete payload.bankChargesAccount;
    delete payload.taxPaidAccount;
    delete payload.stockPayableAccountType;
    delete payload.stockReceivableAccountType;

    updateConfig({
      ...payload,
      defaultSalesCashAcountId: values.defaultSalesCashAcount?._id || '',
      defaultSalesTransferAcountId: values.defaultSalesTransferAcount?._id || '',
      pettyCashAccountId: values.pettyCashAccount?._id || '',
      debtorsAccountTypeId: values.debtorsAccountType?._id || '',
      creditorsAccountTypeId: values.creditorsAccountType?._id || '',
      bankChargesAccountId: values.bankChargesAccount?._id || '',
      taxPaidAccountId: values.taxPaidAccount?._id || '',
      stockPayableAccountTypeId: values.stockPayableAccountType?._id || '',
      stockReceivableAccountTypeId: values.stockReceivableAccountType?._id || ''
    });
  };

  return (
    <div className="">
      <ApForm
        enableReinitialize
        validationSchema={FormSchema}
        initialValues={{
          contactWhatsappNumber: config?.contactWhatsappNumber || '',
        }}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="">
              <div className="mb-8">
                <ApText size="lg" className="font-bold mb-1 cus-sm2:!text-base">
                  Contact Info
                </ApText>
                <hr className="mb-3" />
                <ApTextInput label="Contact Whatsapp Number" name="contactWhatsappNumber" />
              </div>

              {/* sales */}
              <div className="mb-8">
                <ApText size="lg" className="font-bold mb-1 cus-sm2:!text-base">
                  Sales Order Settings
                </ApText>
                <hr className="mb-3" />


              </div>

            </div>

            <ApPageFooter className="!left-0  w-full">
              <ApButton
                title="Update Config"
                loading={updateLoading}
                className="px-3 py-2 text-white bg-cyan-500"
              />
            </ApPageFooter>
          </Form>
        )}
      </ApForm>
    </div>
  );
};
