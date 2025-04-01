import { CHART_DURATION, IChartDuration } from '../service';

interface IDurationBtnProps {
  duration: IChartDuration;
  onPress: (d: IChartDuration) => void;
  activeDuration: CHART_DURATION;
  className?: string;
  disabled?: boolean;
}

export const ApChartDurationBtn: React.FC<IDurationBtnProps> = ({
  duration,
  onPress,
  disabled,
  activeDuration,
  className
}) => {
  return (
    <button
      disabled={disabled}
      className={`
                  rounded-full p-2.5 text-sm cus-xs:text-xs cus-xs:p-2
                  ${
                    activeDuration == duration.label
                      ? 'bg-primary/10 text-primary'
                      : 'bg-primary text-white'
                  }
                  ${className}
              `}
      onClick={() => onPress(duration)}
    >
      {duration?.label}
    </button>
  );
};
