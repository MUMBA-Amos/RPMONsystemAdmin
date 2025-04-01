import { ApTextInput, ApButton, ApDateRangePicker } from '@/components';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import moment from 'moment';
import { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { AcademicSchema } from '../validation';
import { AP_DATE_FORMAT } from '@/constants';

interface IProps {
  sectionType: string;
  formValues: any;
  setFieldValue: any;
  onNext: () => void;
  onBack: () => void;
}

export const AcademicDetails: React.FC<IProps> = ({
  formValues,
  setFieldValue,
  onNext,
  onBack,
  sectionType
}) => {
  const [showForm, setShowForm] = useState(
    formValues?.sections?.filter((section: any) => section.kind === sectionType)?.length > 0
      ? false
      : true
  );

  const handleAdd = async () => {
    try {
      await AcademicSchema.validate(formValues, { abortEarly: false });
      const val = {
        ...formValues?.academic,
        kind: sectionType,
        fromDate: formValues?.academic?.duration?.fromDate,
        toDate: formValues?.academic?.duration?.toDate
      };
      delete val?.duration

      setFieldValue('sections', [...formValues.sections, val]);
      setFieldValue('academic', {});
      setShowForm(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleRemove = (index: number) => {
    const filteredSections = formValues.sections.filter((s: any) => s.kind === sectionType);

    const updatedSections = formValues.sections.filter((s: any, i: number) => {
      if (s.kind === sectionType) {
        return filteredSections.indexOf(s) !== index;
      }
      return true;
    });

    setFieldValue('sections', updatedSections);
  };

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : moment().valueOf();
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

    setFieldValue('academic.duration', { fromDate, toDate });
  };

  return (
    <div className="h-full  flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-center font-semibold mb-5 leading-10 text-primary">ACADEMIC</h1>

        {!showForm && <ApButton onClick={() => setShowForm(true)} type="button" title="Add" />}
      </div>

      {showForm ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ApTextInput
              label="Institution"
              name="academic.institution"
              placeHolder="Enter Institution"
            />

            <ApTextInput
              label="Qualification"
              name="academic.qualification"
              placeHolder="Enter Qualification"
            />
            <ApTextInput
              label="Field of Study"
              name="academic.fieldOfStudy"
              placeHolder="Enter Field of Study"
              containerClassName="col-span-1 md:col-span-2"
            />

            <ApDateRangePicker
              fromLabel="Start Date"
              toLabel="End Date"
              date={formValues?.academic?.duration}
              onChange={(date) => handleDateChange(date)}
              containerClassName={'w-full md:col-span-2 col-span-1'}
            />
          </div>

          <div className="flex gap-3 justify-end mt-5">
            <ApButton
              btnType="outline"
              type="button"
              onClick={() => setShowForm(false)}
              className="!rounded-md !w-[100px]"
            >
              Cancel
            </ApButton>

            <ApButton type="button" onClick={handleAdd} className="!rounded-md !w-[100px]">
              Add
            </ApButton>
          </div>
        </div>
      ) : (
        <div>
          {formValues?.sections?.filter((section: any) => section.kind === sectionType)?.length >
          0 ? (
            <div className="mt-5 flex flex-col gap-5">
              {formValues?.sections
                .filter((section: any) => section.kind === sectionType)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-start text-primary bg-gray-100 text-sm md:text-base p-3 rounded-lg"
                  >
                    <div className="flex flex-col w-full gap-3">
                      <p className="font-bold">
                        Institution{' '}
                        <span className="block text-sm font-light">{item.institution}</span>
                      </p>
                      <p className="font-bold">
                        Qualification{' '}
                        <span className="block text-sm font-light">{item.qualification}</span>
                      </p>
                      <p className="font-bold">
                        Field Of Study{' '}
                        <span className="block text-sm font-light">{item.fieldOfStudy}</span>
                      </p>
                      <p className="font-bold">
                        From Date <span className="block text-sm font-light">{moment(item.fromDate)?.format(AP_DATE_FORMAT)}</span>
                      </p>
                      <p className="font-bold">
                        To Date <span className="block text-sm font-light">{moment(item.toDate)?.format(AP_DATE_FORMAT)}</span>
                      </p>
                    </div>

                    <button type="button" onClick={() => handleRemove(index)}>
                      <IoIosCloseCircleOutline className="text-red-600" />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center p-10">
              <p>No Data</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between w-full mt-10">
        <ApButton type="button" btnType="outline" onClick={onBack}>
          <p>Back</p>
        </ApButton>
        <ApButton
          onClick={() => {
            formValues?.sections?.filter((section: any) => section.kind === sectionType)?.length >
              0 && onNext();
          }}
          type="button"
          btnType="primary"
        >
          <p>Next</p>
          <BsFillArrowRightCircleFill color="white" />
        </ApButton>
      </div>
    </div>
  );
};
