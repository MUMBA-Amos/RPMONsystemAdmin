import { ApTextInput, ApButton } from '@/components';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { ExpertiseSchema } from '../validation';

interface IProps {
  loading: boolean;
  sectionType: string;
  formValues: any;
  setFieldValue: any;
  onNext: () => void;
  onBack: () => void;
}

export const ExpertiseDetails: React.FC<IProps> = ({
  formValues,
  setFieldValue,
  onNext,
  onBack,
  sectionType,
  loading
}) => {
  const [showForm, setShowForm] = useState(
    formValues?.sections?.filter((section: any) => section.kind === sectionType)?.length > 0
      ? false
      : true
  );

  const handleAdd = async () => {
    try {
      await ExpertiseSchema.validate(formValues, { abortEarly: false });
      const val = {
        ...formValues?.expertise,
        kind: sectionType
      };

      setFieldValue('sections', [...formValues.sections, val]);
      setFieldValue('expertise', {});
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

  return (
    <div className="h-full  flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-center font-semibold mb-5 leading-10 text-primary">
          {sectionType}
        </h1>

        {!showForm && <ApButton onClick={() => setShowForm(true)} type="button" title="Add" />}
      </div>

      {showForm ? (
        <div>
          <div className="flex flex-col gap-5">
            <ApTextInput label="Expertise" name="expertise.name" placeHolder="Enter Expertise" />
            <ApTextInput
              label={'Description'}
              type="textarea"
              name="expertise.description"
              placeHolder={`Enter Description`}
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
                        Expertise
                        <span className="block text-sm font-light">{item.name}</span>
                      </p>
                      <p className="font-bold">
                        Description
                        <span className="block text-sm font-light">{item.description}</span>
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
        <ApButton disabled={loading} type="button" btnType="outline" onClick={onBack}>
          <p>Back</p>
        </ApButton>
        <ApButton
          loading={loading}
          onClick={() => {
            formValues?.sections?.filter((section: any) => section.kind === sectionType)?.length >
              0 && onNext();
          }}
          type="button"
          btnType="primary"
        >
          <p>Submit</p>
          <BsFillArrowRightCircleFill color="white" />
        </ApButton>
      </div>
    </div>
  );
};
