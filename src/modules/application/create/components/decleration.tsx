import { ApButton, ApCheckbox, ApFileInput, ApTextInput } from '@/components';
import { Form, Formik } from 'formik';
import { useApplicationState } from '../../context';

export default function GrantApplicationDecleration({
  declaration,
  applicationId,
  onNext,
  onBack,
  additionalFiles,
  setAdditionalFiles
}: any) {
  const { saveApplication, updating } = useApplicationState()

  const handleSubmit = (val: any) => {
    let payload: any = {
      additionalComments: val.comment
    };

    if (additionalFiles?.length > 0) {
      payload = {
        ...payload,
        additionalFiles
      };
    }

    saveApplication(payload, applicationId)
      .then(() => onNext())
  };

  return (
    <div>
      <Formik
        initialValues={{
          revision: declaration?.revision || '',
          comment: declaration?.comment || ''
        }}
        onSubmit={handleSubmit}
      >
        <Form className="flex flex-col gap-5">
          <ApTextInput
            label="Revision 1"
            name="revision"
            placeHolder="Additional Comment....."
          />

          <ApTextInput
            label="Additional Comment"
            type="textarea"
            name="comment"
            placeHolder="Additional Comment....."
          />

          <ApFileInput
            label="Additional Files"
            maxCount={100}
            onSelected={(files) => {
              setAdditionalFiles(files?.map((item) => item?.file) as any);
            }}
          />

          <div className="flex flex-col gap-5 mt-5">
            <ApCheckbox
              name="agreement_1"
              label="All information stated here are accurate, Sarawak RDC, Agency and IHL has right to reject or to cancel the offer without prior notice if there is any inaccurate information given."
            />

            <ApCheckbox
              name="agreement_2"
              label="Application of this research is presented for the Sarawak Research and Development Council Grant Scheme."
            />

            <ApCheckbox
              name="agreement_3"
              label="This proposal has not been submitted to other research grant/s (grant's name and total amount)."
            />

            <ApCheckbox
              name="agreement_4"
              label="There are no conflicts of interest in relation to this proposal."
            />

            <ApCheckbox
              name="agreement_4"
              label="I hereby confirm that I have reviewed all the information provided in this application and certify that it is accurate and complete to the best of my knowledge."
            />
          </div>

          {/* <div className="flex justify-end">
            <ApButton title="Next" className="!w-[200px] !py-3" type="submit" />
          </div> */}

          <div className="flex justify-between mt-10 border-t pt-5">
            <ApButton
              btnType="outline"
              title="Back"
              className="!w-[200px] !py-3"
              type="button"
              onClick={onBack}
            />
            <ApButton loading={updating} type='submit' title="Next" className="!w-[200px] !py-3" />
          </div>
        </Form>
      </Formik>
    </div>
  );
}
