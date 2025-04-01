import environment from '@/environment';
import { useApAxios } from '@/hooks';
import { toastSvc } from '@/services';
import saveAs from 'file-saver';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';
import { BsDownload } from 'react-icons/bs';
import { ApPopover } from '../modal';
import { ApButton } from './button';
import { printUrl } from '@/utils';

export type TDownloadType = 'PDF' | 'XLSX';

// function appendQuery(url: string, { key, value }: { key: string; value: string }): string {
//   const separator = url.includes('?') ? '&' : '?';
//   return `${url}${separator}${key}=${value}`;
// }
function appendQuery(url: string, params: { [key: string]: string }): string {

  try {

    const urlObj = new URL(url);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        urlObj.searchParams.append(key, params[key]);
      }
    });
    return urlObj.toString();
  } catch {
    console.log("invalid url", url);
    throw "invlid url"
  }
}

interface IProps {
  title: string;
  apiName?: string;
  apiPath: string | any;
  filename?: string;
  hasData?: boolean;
  noDataMessage?: string;
  types?: TDownloadType[];
  filter?: any;
  className?: string;
  disabled?: boolean;
}


// const printPdf = (url: string) => {
//   const printWindow: any = window.open(url, '_blank');
//   printWindow.onload = () => {
//     setTimeout(() => {
//       printWindow.print();
//     }, 100);
//   };
// };


export const ApDownloadButton: React.FC<IProps> = (props: IProps) => {
  const {
    title,
    apiName,
    apiPath,
    filename,
    hasData,
    className,
    disabled,
    noDataMessage,
    types = ['PDF', 'XLSX'],
    filter
  } = props;
  const popoverRef = useRef<any>();

  const [downloading, setDownloading] = React.useState(false);

  const { http } = useApAxios();

  const downloadReport = async (type: TDownloadType) => {


    // TODO: remove line when all pdf downloa update
    const uri = typeof apiPath === "string" ? appendQuery(`${apiName || environment.Uri.Api}${apiPath}`, {
      ...filter,
      downloadType: type
    }) : appendQuery(apiPath[type], {
      ...filter,
      downloadType: type
    });

    // TODO: actual implementation of above comment;
    // const uri = appendQuery(apiPath[type], {
    //   ...filter,
    //   downloadType: type
    // });


    setDownloading(true);

    try {

      if (type === "PDF" && typeof apiPath !== "string") {
        await printUrl(uri);

        setDownloading(false);

        return;
      }

      await http
        .get(uri, {
          responseType: 'blob'
        })
        .then((res) => {
          if (res) {
            saveAs(res.data, `${filename || 'download'}.${type.toLowerCase()}`);
          }
        })
        .finally(() => {
          setDownloading(false);
        });
    } catch (error) {
      toastSvc.error('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };



  return (
    <ApPopover
      ref={popoverRef}
      content={
        hasData ? (
          <div className="flex flex-col gap-2 w-[150px]">
            {types?.map((type) => (
              <div key={type} role="button" onClick={() => downloadReport(type)}>
                {type}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-[150px]">
            <div>{noDataMessage || 'No Data'}</div>
          </div>
        )
      }
    >
      <ApButton
        loading={downloading}
        disabled={disabled}
        title={
          <>
            <BsDownload />
            {title}
          </>
        }
        className={`bg-primary h-[43px] ${className}`}
        onClick={() => {
          popoverRef.current.toggle();
        }}
      />
    </ApPopover>
  );
};

type Tprops = {
  reportType: 'Sales' | 'Purchase';
  fromDate?: number | Date;
  toDate?: number | Date;
};

export const ApOrderDownloadButton: React.FC<Tprops> = ({ reportType, fromDate, toDate }) => {
  const session: any = useSession();
  const [downloading, setDownloading] = React.useState(false);
  const { http } = useApAxios();

  const downloadReport = async () => {
    setDownloading(true);
    await http
      .get(
        `report/download/${reportType}Order/${moment(fromDate).valueOf()}/${moment(toDate).valueOf()}/${session?.data?.token}`,
        { responseType: 'blob' }
      )
      .then((res) => {
        saveAs(res.data, `${reportType} Report.pdf`);
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  return (
    <ApButton
      className="font-light w-[200px]"
      title="Download Report 2"
      onClick={downloadReport}
      loading={downloading}
    />
  );
};
