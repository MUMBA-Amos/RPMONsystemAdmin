import React, { FC } from 'react'
import { IAccessGroup } from '../model'
import { Form, Formik } from 'formik'
import { ApButton, ApTextInput } from '../../../../components'
import { useAccessGroupState } from '../context'
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
    group: Yup.string().required("Group name is required"),
});

interface IProps {
    type?: "Create Group" | "Update Group"
    group?: IAccessGroup
    onDismiss: () => void
}

export const CreateOrUpdateGroup: FC<IProps> = ({ onDismiss, group, type }) => {
    const {createAccessGroup, updateAccessGroup, loading} = useAccessGroupState()

    const handleSubmit = (val: any) => {
        if(type == 'Create Group'){
            createAccessGroup({group: val.group})
            .then(() => {
                onDismiss()
            })
        } else {
            updateAccessGroup(group?._id as any, {group: val.group})
            .then(() => {
                onDismiss()
            })
        }
    }

  return (
    <div>
        <Formik
            initialValues={{
                group: type == 'Update Group' ? group?.group : ''
            }}
            onSubmit={handleSubmit}
            validationSchema={FormSchema}
        >
            <Form>
                <ApTextInput
                    name='group'
                    label='Group'
                    placeholder='Enter group name'
                    className='!h-[45px]'
                />

                <div className='flex justify-end mt-20'>
                    <ApButton
                        type='submit'
                        title={type}
                        loading={loading}
                        className='py-3 !px-5'
                    />
                </div>
            </Form>
        </Formik>
    </div>
  )
}