import { ApTextInput, ApButton, ApDateRangePicker, ApMasterSelectInput } from '@/components';
import ApDateInput from '@/components/input/DatePicker';
import { FieldArray, useFormikContext } from 'formik';
import { SectionSchema } from '../validation';
import React, { useEffect, useState } from 'react';
import { BsFillArrowRightCircleFill, BsFillTrashFill } from 'react-icons/bs';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import moment from 'moment';

interface IProps {
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
  sectionType: 'ACADEMIC' | 'EXPERIENCE' | 'QUALIFICATION' | 'AWARDS' | 'EXPERTISE' | 'CONTRACT';
}

export const SectionDetails: React.FC<IProps> = ({ loading, onNext, onBack, sectionType }) => {
  const { values, setFieldValue, submitForm, setErrors, validateForm, setTouched } =
    useFormikContext<any>();
  const [duration, setDuration] = useState<{ fromDate: number; toDate: number }>({
    fromDate: 0,
    toDate: 0
  });

  const handleAdd = async () => {
    let newEntry: any = {
      kind: sectionType
    };

    switch (sectionType) {
      case 'ACADEMIC':
        newEntry = {
          ...newEntry,
          institution: values.institution,
          qualification: values.qualification,
          fieldOfStudy: values.fieldOfStudy,
          fromDate: duration.fromDate,
          toDate: duration.toDate
        };
        break;

      case 'EXPERIENCE':
        newEntry = {
          ...newEntry,
          institution: values.institution,
          role: values.role,
          fromDate: duration.fromDate,
          toDate: duration.toDate
        };
        break;

      case 'QUALIFICATION':
        newEntry = {
          ...newEntry,
          institution: values.institution,
          qualification: values.qualification,
          fieldOfStudy: values.fieldOfStudy,
          fromDate: duration.fromDate,
          toDate: duration.toDate
        };
        break;

      case 'AWARDS':
        newEntry = {
          ...newEntry,
          name: values.name,
          description: values.description,
          institution: values.institution,
          fromDate: duration.fromDate,
          toDate: duration.toDate
        };
        break;

      case 'EXPERTISE':
        newEntry = {
          ...newEntry,
          name: values.name,
          description: values.description
        };
        break;

      case 'CONTRACT':
        newEntry = {
          ...newEntry,
          name: values.name,
          contractTypeId: values?.contractTypeId?._id ?? null,
          fromDate: duration.fromDate,
          toDate: duration.toDate
        };
        break;

      default:
        console.warn(`Unhandled section type: ${sectionType}`);
        return;
    }

    try {
      await SectionSchema.validate(newEntry, { abortEarly: false });

      setFieldValue('sections', [...values.sections, newEntry]);

      Object.keys(newEntry).forEach((key) => setFieldValue(key, ''));
      setDuration({ fromDate: 0, toDate: 0 });
    } catch (error: any) {
      console.log({ error });
      if (error.inner) {
        const sectionErrors = error.inner.reduce((acc: any, err: any) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        console.log({ sectionErrors });

        setErrors(sectionErrors);
      }
    }
  };

  const handleRemove = (index: number) => {
    const filteredSections = values.sections.filter((s: any) => s.kind === sectionType);

    const updatedSections = values.sections.filter((s: any, i: number) => {
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

    setDuration({ fromDate, toDate });
  };

  const handleNext = async () => {
    if (sectionType === 'CONTRACT') {
      await handleAdd();
    }
    onNext();
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <h1 className="text-xl text-center font-semibold mb-5 leading-10 text-primary">
        {sectionType.replace('_', ' ')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {['ACADEMIC', 'EXPERIENCE', 'QUALIFICATION'].includes(sectionType) && (
          <ApTextInput
            label="Institution"
            name="institution"
            value={values.institution}
            placeHolder="Enter Institution"
          />
        )}
        {sectionType === 'ACADEMIC' && (
          <ApTextInput
            label="Qualification(s)"
            name="qualification"
            placeHolder="Enter Qualification"
            value={values.qualification}
          />
        )}
        {sectionType === 'EXPERIENCE' && (
          <ApTextInput label="Role" name="role" value={values.role} placeHolder="Enter Role" />
        )}
        {['ACADEMIC', 'QUALIFICATION'].includes(sectionType) && (
          <ApTextInput
            label="Field of Study"
            name="fieldOfStudy"
            placeHolder="Enter Field of Study"
            value={values.fieldOfStudy}
          />
        )}
        {['AWARDS', 'EXPERTISE'].includes(sectionType) && (
          <div className="flex flex-col gap-10 col-span-2">
            <ApTextInput
              label={sectionType === 'AWARDS' ? 'Award Name' : 'Expertise'}
              name="name"
              value={values.name}
              placeHolder={`Enter ${sectionType === 'AWARDS' ? 'Award Name' : 'Expertise'}`}
            />
            <ApTextInput
              label={'Description'}
              type="textarea"
              name="description"
              value={values.description}
              placeHolder={`Enter Description`}
            />
          </div>
        )}
        {sectionType === 'AWARDS' && (
          <ApTextInput
            label="Awarding Body"
            name="institution"
            value={values.institution}
            placeHolder="Enter Awarding Body"
          />
        )}
        {sectionType === 'CONTRACT' && (
          <>
            <ApTextInput
              containerClassName="w-full"
              label="Service"
              name="name"
              type="text"
              placeHolder="Input Service"
            />
            <ApMasterSelectInput
              masterKey="contract_type"
              containerClassName="w-full"
              label="Contract Type"
              name="contractTypeId"
            />
          </>
        )}
        {['ACADEMIC', 'EXPERIENCE', 'QUALIFICATION', 'AWARDS', 'CONTRACT'].includes(
          sectionType
        ) && (
          <div
            className={`flex flex-col md:flex-row gap-10 ${['EXPERIENCE', 'QUALIFICATION', 'CONTRACT'].includes(sectionType) ? 'md:col-span-2' : ''}`}
          >
            <ApDateRangePicker
              fromLabel="Start Date"
              toLabel="End Date"
              date={duration}
              onChange={(date) => handleDateChange(date)}
              containerClassName={'w-full'}
            />
          </div>
        )}
      </div>

      {sectionType !== 'CONTRACT' && (
        <ApButton type="button" onClick={handleAdd} className="!w-full !rounded-md mt-5">
          Add {sectionType.replace('_', ' ')}
        </ApButton>
      )}

      {sectionType !== 'CONTRACT' && (
        <FieldArray
          name="sections"
          render={() => {
            return (
              <div className="mt-5">
                {values.sections
                  .filter((section: any) => section.kind === sectionType)
                  .map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-primary bg-gray-100 text-sm md:text-base p-3 rounded-lg mb-2"
                    >
                      <div className="flex justify-center w-full gap-4 items-center">
                        <p className="">
                          {item.role ||
                            item.qualification ||
                            item.name ||
                            item.fieldOfStudy ||
                            item.service}
                        </p>
                        <p>{item.institution}</p>
                        <p>{item.description}</p>
                        <p>
                          {' '}
                          {item.fromDate ? new Date(item.fromDate).toLocaleDateString() : ''} -{' '}
                        </p>
                        <p>{item.toDate ? new Date(item.toDate).toLocaleDateString() : ''}</p>
                      </div>
                      <button onClick={() => handleRemove(index)}>
                        <IoIosCloseCircleOutline className="text-red-600" />
                      </button>
                    </div>
                  ))}
              </div>
            );
          }}
        />
      )}

      <div className="flex justify-between mt-6">
        <ApButton type="button" onClick={onBack} btnType="outline">
          Back
        </ApButton>
        <ApButton
          type={sectionType === 'EXPERTISE' || sectionType === 'CONTRACT' ? 'submit' : 'button'}
          onClick={handleNext}
          btnType="primary"
          loading={loading}
        >
          {sectionType !== 'EXPERTISE' && sectionType !== 'CONTRACT' ? (
            <>
              Next <BsFillArrowRightCircleFill className="ml-2" />
            </>
          ) : (
            'Submit'
          )}
        </ApButton>
      </div>
    </div>
  );
};
