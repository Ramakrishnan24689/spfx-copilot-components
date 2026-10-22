import * as React from 'react';
import {
  FluentProvider,
  IdPrefixProvider,
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
  type Theme
} from '@fluentui/react-components';
import { createDOMRenderer, makeStyles, RendererProvider } from '@griffel/react';

const revenueBrand: BrandVariants = {
  10: '#06101D', 20: '#0B1A2B', 30: '#10253B', 40: '#132F4C', 50: '#123B62',
  60: '#0D4B81', 70: '#075BA2', 80: '#0B6DC1', 90: '#147FE0', 100: '#2C91F0',
  110: '#4AA2F5', 120: '#6CB3F8', 130: '#91C6FA', 140: '#B5D9FC', 150: '#D9ECFE', 160: '#F1F8FF'
};

const lightTheme: Theme = {
  ...createLightTheme(revenueBrand),
  colorNeutralBackground1: '#F7F4EE',
  colorNeutralBackground2: '#EEEAE2',
  colorNeutralForeground1: '#13263D',
  colorNeutralForeground2: '#405064'
};
const darkTheme: Theme = {
  ...createDarkTheme(revenueBrand),
  colorNeutralBackground1: '#0D1826',
  colorNeutralBackground2: '#13263D',
  colorNeutralForeground1: '#F7F4EE',
  colorNeutralForeground2: '#C7D1DE'
};

const useStyles = makeStyles({
  provider: { width: '100%', minWidth: 0, minHeight: '100%', backgroundColor: 'transparent' }
});

export interface IRevenueThemeProviderProps {
  readonly theme?: string;
  readonly targetDocument: Document;
  readonly children?: React.ReactNode;
}

function RevenueThemeSurface(props: IRevenueThemeProviderProps): React.ReactElement {
  const styles = useStyles();
  return (
      <IdPrefixProvider value="zdr-">
        <FluentProvider
          theme={props.theme === 'dark' ? darkTheme : lightTheme}
          targetDocument={props.targetDocument}
          className={styles.provider}
        >
          {props.children}
        </FluentProvider>
      </IdPrefixProvider>
  );
}

export default function RevenueThemeProvider(props: IRevenueThemeProviderProps): React.ReactElement {
  const renderer = React.useMemo(() => createDOMRenderer(props.targetDocument), [props.targetDocument]);
  return <RendererProvider renderer={renderer} targetDocument={props.targetDocument}><RevenueThemeSurface {...props} /></RendererProvider>;
}