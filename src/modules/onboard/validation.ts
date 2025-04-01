import * as Yup from 'yup';

export const PersonalInfoSchema = Yup.object().shape({
  user: Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    titleId: Yup.object().shape({
      value: Yup.string().required('Salutation is required')
    }),
    genderId: Yup.object().shape({
      value: Yup.string().required('Gender is required')
    }),
    nationalityId: Yup.object().shape({
      value: Yup.string().required('Nationality is required') // Changed 'Race' to 'Nationality' for clarity
    }),
    idTypeId: Yup.object().shape({
      value: Yup.string().required('ID Type is required')
    }),
    idNumber: Yup.string().required('ID Number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    dateOfBirth: Yup.number().required('Date of Birth is required')
  }),
  residenceStatusId: Yup.object().shape({
    value: Yup.string().required('Residence Status is required')
  })
});

export const ProfessionalInfoSchema = Yup.object().shape({
  organizationId: Yup.object().shape({
    value: Yup.string().required('Organization is required')
  }),
  officeNumber: Yup.string().required('Office Number is required'),
  designationId: Yup.object().shape({
    value: Yup.string().required('Designation is required')
  }),
  researchClusterIds: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required('Research Cluster is required')
      })
    )
    .min(1, 'At least one Research Cluster is required')
});

export const ContactSchema = Yup.object().shape({
  contract: Yup.object().shape({
    contractTypeId: Yup.object().shape({
      value: Yup.string().required('Contract Type is required')
    }),
    name: Yup.string().required('Name is required'),
    duration: Yup.object().shape({
      fromDate: Yup.string().required('Duration is required')
    })
  })
});

export const AcademicSchema = Yup.object().shape({
  academic: Yup.object().shape({
    institution: Yup.string().required('Institution is required'),
    qualification: Yup.string().required('Qualification is required'),
    fieldOfStudy: Yup.string().required('Field Of Study is required'),
    duration: Yup.object().shape({
      fromDate: Yup.string().required('Duration is required')
    })
  })
});

export const AwardsSchema = Yup.object().shape({
  awards: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    institution: Yup.string().required('Awarding body is required'),
    duration: Yup.object().shape({
      fromDate: Yup.string().required('Duration is required')
    })
  })
});

export const ExperienceSchema = Yup.object().shape({
  experience: Yup.object().shape({
    institution: Yup.string().required('Institution is required'),
    role: Yup.string().required('Role is required'),
    duration: Yup.object().shape({
      fromDate: Yup.string().required('Duration is required')
    })
  })
});

export const QualificationSchema = Yup.object().shape({
  qualification: Yup.object().shape({
    institution: Yup.string().required('Institution is required'),
    fieldOfStudy: Yup.string().required('Field Of Study is required'),
    duration: Yup.object().shape({
      fromDate: Yup.string().required('Duration is required')
    })
  })
});

export const ExpertiseSchema = Yup.object().shape({
  expertise: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required')
  })
});

export const SectionSchema = Yup.object().shape({
  sections: Yup.array().of(
    Yup.object().shape({
      kind: Yup.string().oneOf([
        'ACADEMIC',
        'EXPERIENCE',
        'AWARD',
        'EXPERTISE',
        'QUALIFICATION',
        'CONTRACT'
      ]),
      institution: Yup.string().required(),
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      qualification: Yup.string().required('Description is required'),
      fieldOfStudy: Yup.string().when('kind', {
        is: 'ACADEMIC',
        then: (schema) => schema.required('Field of study is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      role: Yup.string().when('kind', {
        is: 'EXPERIENCE',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.notRequired()
      }),
      contractTypeId: Yup.string()
        .min(3, 'Contract Type must be atleast 3 characters long')
        .required('Contract type is required')
      // fromDate: Yup.date().required('Start Date is required'),
      // toDate: Yup.date().required('End Date is required')
    })
  )
});

export const FormSchema = PersonalInfoSchema.concat(ProfessionalInfoSchema.concat(SectionSchema));
