import React from 'react';
import { ApChartDurationBtn, CHART_DURATION, CHART_DURATIONS, IChartDuration } from '../chart';
import { ApDateRangePicker } from './DateRangePicker';
import { ApDownloadButton } from '../button';

interface IProps {
  filter: {
    fromDate: number;
    toDate: number;
  };
  disabled?: boolean;
  activeDuration: CHART_DURATION;
  handleDurationChange: (duration: IChartDuration) => void;
  handleDateChange: (date: { fromDate: number | null; toDate: number | null }) => void;
  right?: React.ReactNode;
}

export const ApDurationPicker: React.FC<IProps> = (props: IProps) => {
  const { filter, activeDuration, disabled, right, handleDurationChange, handleDateChange } = props;
  return (
    <div className="flex cus-md3:flex-col  gap-3">
      <div className="flex justify-center cus-sm:w-[300px] cus-md3:justify-start gap-2">
        {CHART_DURATIONS?.map((d, i) => (
          <ApChartDurationBtn
            duration={d}
            key={d.label}
            disabled={disabled}
            className="w-12 h-12 !p-0 text-xs"
            onPress={handleDurationChange}
            activeDuration={activeDuration}
          />
        ))}
      </div>
      <div className="flex cus-sm:flex-col cus-sm:w-[300px] gap-3 items-center cus-sm:items-start">
        <ApDateRangePicker
          disabled={disabled}
          date={{ fromDate: filter?.fromDate, toDate: filter?.toDate }}
          onChange={handleDateChange}
        />

        {right}
      </div>
    </div>
  );
};
