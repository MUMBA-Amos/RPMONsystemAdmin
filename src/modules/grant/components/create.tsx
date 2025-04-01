import {
  ApButton,
  ApDateRangePicker,
  ApMasterSelectInput,
  ApModal,
  ApSelectInputAsync,
  ApTextInput
} from '@/components';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useBatchState } from '@/modules/batch/context';
import { Formik } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useGrantState } from '../context';
import { IBatch, IGrant } from '../model';
import { CreateBatch } from '@/modules/batch/components/create';
import { useOrganizationState } from '@/modules/organization/context';
import { IOrganization } from '@/modules/organization/model';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Grant Name is required'),
  description: Yup.string().required('Grant Description is required'),
  budget: Yup.number().required('Grant Budget is required'),
  clusterId: Yup.object()
    .shape({
      value: Yup.string()
    })
    .required('Research Cluster is required'),
  schemeId: Yup.object()
    .shape({
      value: Yup.string()
    })
    .required('Scheme is required')
});

interface IProps {
  grant: IGrant;
  onDissmiss: () => void;
}

export const CreateGrant: React.FC<IProps> = ({ grant, onDissmiss }) => {
  const { saveGrant, modal, setModal, updating } = useGrantState();
  const { fetchBatch } = useBatchState();
  const { fetchOrganization } = useOrganizationState();
  const [duration, setDuration] = useState<{ fromDate: number; toDate: number }>({
    fromDate: grant?.fromDate || 0,
    toDate: grant?.toDate || 0
  });

  const handleSubmit = (values: any) => {
    const { fromDate, toDate } = duration;

    const payload = {
      ...values,
      budget: +values.budget,
      clusterId: values.clusterId._id,
      schemeId: values.schemeId._id,
      fromDate,
      toDate
    };

    delete payload?.organizationId;

    saveGrant(grant?._id, payload).then((res) => {
      if (res) {
        onDissmiss();
      }
    });
  };

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : moment().valueOf();
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

    setDuration({ fromDate, toDate });
  };

  const handleFilterBatch = (inputValue: string) =>
    new Promise<IBatch[]>((resolve) => {
      fetchBatch({ keyword: inputValue, page: 1, pageSize: DEFAULT_PAGE_SIZE }).then((res) => {
        resolve(res?.data || []);
      });
    });

  const handleFilterOrganization = (inputValue: string) =>
    new Promise<IOrganization[]>((resolve) => {
      fetchOrganization({ keyword: inputValue, page: 1, pageSize: DEFAULT_PAGE_SIZE }).then(
        (res) => {
          resolve(res?.data || []);
        }
      );
    });

  const handleCreateBatch = (inputValue: string) => {
    setModal({ show: true, type: 'create-batch', data: { name: inputValue } });
  };

  return (
    <>
      <Formik
        initialValues={{
          name: grant?.name || '',
          description: grant?.description || '',
          clusterId: grant?.clusterId
            ? { label: grant?.cluster?.name, value: grant?.cluster?._id }
            : { label: '', value: '' },
          schemeId: grant?.schemeId
            ? { label: grant?.scheme?.name, value: grant?.scheme?._id }
            : { label: '', value: '' },
          budget: grant?.budget || 0
        }}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm }) => (
          <div className="flex flex-col space-y-4">
            <ApTextInput
              type="text"
              name="name"
              label="Grant Name"
              placeholder="Grant Name"
              containerClassName={'w-full'}
            />
            <div className="flex gap-4">
              <ApMasterSelectInput
                label="Research Cluster"
                masterKey="research_cluster"
                name="clusterId"
                placeholder="Research Cluster"
                containerClassName={'w-full'}
              />

              <ApMasterSelectInput
                label="Grant Scheme"
                masterKey="grant_scheme"
                name="schemeId"
                placeholder="Grant Scheme"
                containerClassName={'w-full'}
              />
            </div>

            <ApTextInput
              type="textarea"
              name="description"
              label="Grant Description"
              placeholder="Grant Description"
              containerClassName={'w-full'}
            />
            <ApTextInput
              type="number"
              name="budget"
              label="Budget"
              placeholder="500,000"
              containerClassName={'w-full'}
            />
            <ApDateRangePicker
              fromLabel="From Date"
              toLabel="To Date"
              date={duration}
              onChange={(date) => handleDateChange(date)}
              containerClassName={'w-full'}
            />
            <ApButton
              title={grant?._id ? 'Update' : 'Create'}
              type="submit"
              onClick={submitForm}
              loading={updating}
              disabled={updating}
            />
          </div>
        )}
      </Formik>
      {modal.type === 'create-batch' && (
        <ApModal
          show={modal.show}
          onDimiss={() => {
            setModal({ show: false, type: 'create-batch' });
          }}
        >
          {modal.type === 'create-batch' && (
            <CreateBatch
              batch={modal.data}
              onDissmiss={() => {
                setModal({ show: false });
              }}
            />
          )}
        </ApModal>
      )}
    </>
  );
};
