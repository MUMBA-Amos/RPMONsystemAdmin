import { GroupBase, StylesConfig, ThemeConfig } from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager';

export interface IProps extends StateManagerProps {
  name: string;
  label?: string;
  isMulti?: boolean;
  height?: string;
  labelKey?: string;
  valueKey?: string;
  ignoreFormik?: boolean;
  inputClassName?: string;
  helperText?: string;
  containerClassName?: string | undefined;
  onChange?: (value: any) => void;
}

export const styles = (props: any) => {
  return {
    control: (baseStyles: any, state: any) => ({
      ...baseStyles,
      height: props?.height || '45px',
      borderWidth: 1,
      fontSize: '13px',
      borderRadius: '2px',
      borderColor: state.isFocused ? '#E9E9E9' : '#ddd'
    })
  } as StylesConfig<unknown, boolean, GroupBase<unknown>> | undefined;
};

export const theme: ThemeConfig | undefined = (theme: any) => ({
  ...theme,
  colors: {
    ...theme.colors
  }
});
