import { ApButton, ApFileInput, ApSelectInput, ApTextInput } from '@/components';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useApplicationState } from '../../context';
import { ApplicationStatus } from '../../model';

export default function GrantApplicationDetail({
  files,
  setFiles,
  onNext,
  details,
  applicationId,
  grantId
}: any) {
  const { saveApplication, updating } = useApplicationState()

  const handleSubmit = (val: any) => {
    let payload: any = {
      grantId,
      proposalTitle: val.proposalTitle,
      researchFocus: val.researchFocus,
      executiveSummary: val.executiveSummary,
      designAndMethod: val.designAndMethod,
      rationalAndBackground: val.rationalAndBackground,
      researchObjective: val.researchObjective,
      expectedOutcome: val.expectedOutcome,
      patentableReason: val.patentableReason,
      status: ApplicationStatus.DRAFT
    };

    if (files?.length > 0) {
      payload = {
        ...payload,
        files
      };
    }

    if (applicationId) {
      saveApplication(payload, applicationId)
        .then(() => onNext())
    } else {
      saveApplication({ ...payload, comment: '' })
        .then(() => onNext())
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          type: details?.type || '',
          proposalTitle: details?.proposalTitle || '',
          researchFocus: details?.researchFocus || '',
          executiveSummary: details?.executiveSummary || '',
          designAndMethod: details?.designAndMethod || '',
          researchObjective: details?.researchObjective || '',
          patentableReason: details?.patentableReason || '',
          expectedOutcome: details?.expectedOutcome || '',
          rationalAndBackground: details?.rationalAndBackground || '',
          // comment: details?.comment || ''
        }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form className="flex flex-col gap-5">
          {/* <ApSelectInput label="Grant Type" name="type" placeholder="Grant Type" /> */}

          <ApTextInput
            label="Proposed Title"
            name="proposalTitle"
            placeHolder="Proposed Title...."
          />


          <ApTextInput type="textarea" label="Research Objective" name="researchObjective" placeHolder="Research Objective" />

          <ApTextInput type="textarea" label="Research Focus" name="researchFocus" placeHolder="Research Focus" />

          <ApTextInput
            type="textarea"
            label="Executive Summary"
            name="executiveSummary"
            placeHolder="Executive Summary"
          />

          <ApTextInput
            type="textarea"
            label="Design & Method"
            name="designAndMethod"
            placeHolder="Design & Method"
          />

          <ApTextInput
            label="Rational And Background"
            type="textarea"
            name="rationalAndBackground"
            placeHolder="Rational And Background....."
          />

          <ApTextInput type="textarea" label="Expected Outcome" name="expectedOutcome" placeHolder="Research Expected Outcome" />


          <ApTextInput type="textarea" label="Patentable Reason" name="patentableReason" placeHolder="Patentable reasons" />


          <ApFileInput
            label="Attachments"
            maxCount={100}
            onSelected={(files) => {
              setFiles(files?.map((item) => item?.file) as any);
            }}
          />

          <div className="flex justify-end">
            <ApButton title="Next" className="!w-[200px] !py-3" type="submit" loading={updating} />
          </div>
        </Form>
      </Formik>
    </div>
  );
}
