import React from 'react';
import { useExtenstionState } from './context';
import ApTable from '@/components/table';
import { render } from 'react-dom';
import { ApDateTime } from '@/components/date';

interface IProps {
    applicationId?: string;
}

const ExtensionPage: React.FC<IProps> = ({ applicationId }) => {

    const { fetchExtenstions, extenstions } = useExtenstionState();

    React.useEffect(() => {
        fetchExtenstions({ page: 1, pageSize: 500, applicationId });
    }, [applicationId]);


    const columns: any = [{
        title: 'Ref',
        dataIndex: 'ref',
        key: 'ref',
    }, {
        title: 'Justification',
        dataIndex: 'justification',
        width: "70%",
        render: (val: any, record: any) => {
            return <div className='w-full text-wrap'>{val}</div>
        }
    }, {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        align: "right",
        render: (val: any, record: any) => {
            return <ApDateTime date={val} format="YYYY-MM-DD HH:mm:ss" />
        }
    }]

    return (
        <div>
            <p className="text-center mt-5 text-xl text-primary font-bold">
                EXTENSIONS
            </p>
            <ApTable
                columns={columns}
                dataSource={extenstions}
                pagination={false} />
        </div>
    )
}

export default ExtensionPage;