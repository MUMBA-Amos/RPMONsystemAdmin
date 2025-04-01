import { ApButton, ApConfirm, ApTextInput } from '@/components';
import React, { useState } from 'react';
import { useApplicationState } from '../application/context';
import { getStatusClassName, IApplication } from '../application/model';
import ReportExtension from '../report/item/components/extenstion';
import { useExtenstionState } from './context';
import { IExtenstion } from './model';

interface IProps {
    application?: IApplication;
}

const ApplicationExtensionPage: React.FC<IProps> = ({ application }) => {

    const { updateStatus } = useExtenstionState();

    const { fetchApplication } = useApplicationState();

    const [statusComment, setStatusComment] = useState('');

    const handleUpdateStatus = (status: string, extenstion: IExtenstion) => {
        ApConfirm({
            title: "Confirmation!",
            message: `Update application extension ${status}`,
            children: <RenderStatusComment />,
            callback(val) {
                if (val) {
                    updateStatus({
                        status,
                        _id: extenstion?._id as string,
                        comment: statusComment
                    }).then(() => {
                        fetchApplication(application?._id as string)
                    })
                }
            },
        });
    }

    const RenderStatusComment = () => {
        return <div className='mt-5'>
            <ApTextInput type="textarea" label="Comment" ignoreFormik onChange={(val: any) => {
                setStatusComment(val);
            }} />
        </div>
    }


    return (
        <div>
            <p className="text-center my-10 text-xl text-primary font-bold">
                APPLICATION EXTENSION
            </p>

            {application?.extensions?.map((extenstion: IExtenstion, index: number) => {
                return (
                    <div key={extenstion._id} className="border mb-10 border-primary overflow-hidden rounded-lg">
                        <div className="flex  justify-between items-center bg-primary text-white px-5 py-3 font-bold text-xl">

                            <div>
                                Extenstion {index + 1}
                            </div>

                            <div className='flex flex-col gap-5  items-center'>
                                <p className='text-sm text-white text-right w-full'>Status: {extenstion?.status}</p>

                                <div className="flex justify-end gap-3">
                                    {extenstion?.extensionStatuses?.map((status, i) => <ApButton key={i} className={`!rounded-full z-10 px-5 ${getStatusClassName(status)}`} title={status} onClick={() => handleUpdateStatus(status, extenstion)} />)}
                                </div>
                            </div>


                        </div>
                        <ReportExtension application={application} extenstion={extenstion} reportId={extenstion.reportId} />
                    </div>
                )
            }
            )}
        </div>
    )
}

export default ApplicationExtensionPage;