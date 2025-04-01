import {
  ApTextInput,
  ApButton,
  ApSelectInputAsync,
  ApSelectInput,
  ApMasterSelectInput
} from '@/components';
import { useFormikContext } from 'formik';
import { ProfessionalInfoSchema } from '../validation';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { useOrganizationState } from '@/modules/organization/context';
import { useEffect } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface IProps {
  onNext: () => void;
  onBack: () => void;
}

export const ProfessionalDetails: React.FC<IProps> = ({ onNext, onBack }) => {
  const { fetchOrganization, organizations } = useOrganizationState();

  useEffect(() => {
    fetchOrganization({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, []);

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="h-full  flex flex-col justify-between">
      <h1 className="text-xl text-center font-semibold mb-5 leading-10 text-primary">
        PROFESSIONAL INFORMATION
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-10">
          <ApSelectInput
            containerClassName="w-full md:w-[50%]"
            label="ORGANISATION"
            name="organizationId"
            options={organizations.map((org) => ({
              label: org.name,
              value: org._id
            }))}
            helperText="(Select The Organisation You are Currently Affiliated with)"
          />
          <ApTextInput
            containerClassName="w-full md:w-[50%]"
            label="OFFICE NUMBER"
            name="officeNumber"
            type="text"
            placeHolder="Input Office Number"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <ApMasterSelectInput
            masterKey="designation"
            containerClassName="w-full"
            label="DESIGNATION"
            name="designationId"
          />
          <ApMasterSelectInput
            masterKey="research_cluster"
            containerClassName="w-full"
            label="RESEARCH CLUSTER"
            name="researchClusterIds"
            helperText="(Add Multiple Research Cluster by Typing And Pressing Enter)"
            isMulti
          />
        </div>
      </div>

      <div className="flex justify-between w-full mt-10">
        <ApButton type="button" btnType="outline" onClick={onBack}>
          <p>Back</p>
        </ApButton>
        <ApButton type="submit" btnType="primary">
          <p>Next</p>
          <BsFillArrowRightCircleFill color="white" />
        </ApButton>
      </div>
    </div>
  );
};
