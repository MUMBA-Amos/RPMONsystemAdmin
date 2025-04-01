import {
  ApTextInput,
  ApButton,
  ApMasterSelectInput,
  ApDateRangePicker
} from '@/components';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import moment from 'moment';

interface IProps {
  loading: boolean
  formValues: any;
  setFieldValue: any;
  onNext: () => void;
  onBack: () => void;
}

export const ContractDetails: React.FC<IProps> = ({
  formValues,
  setFieldValue,
  onNext,
  onBack,
  loading
}) => {

  const handleNext = () => {
    onNext();
  };

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : moment().valueOf();
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

    setFieldValue('contract.duration', { fromDate, toDate });
  };

  return (
    <div className="h-full  flex flex-col justify-between">
      <h1 className="text-xl text-center font-semibold mb-5 leading-10 text-primary">CONTRACT</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ApTextInput
          containerClassName="w-full"
          label="Service"
          name="contract.name"
          type="text"
          placeHolder="Input Service"
        />
        <ApMasterSelectInput
          masterKey="contract_type"
          containerClassName="w-full"
          label="Contract Type"
          name="contract.contractTypeId"
        />

        <ApDateRangePicker
          fromLabel="Start Date"
          toLabel="End Date"
          date={formValues?.contract?.duration}
          onChange={(date) => handleDateChange(date)}
          containerClassName={'w-full md:col-span-2 col-span-1'}
        />
      </div>

      <div className="flex justify-between w-full mt-10">
        <ApButton disabled={loading} type="button" btnType="outline" onClick={onBack}>
          <p>Back</p>
        </ApButton>
        <ApButton loading={loading} type="submit" btnType="primary">
          <p>Submit</p>
          <BsFillArrowRightCircleFill color="white" />
        </ApButton>
      </div>
    </div>
  );
};
