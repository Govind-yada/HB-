import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '../config/constants';
import { ResponsiveInfo } from '../types/auth';

/**
 * Responsive layout hook detecting mobile, tablet, and desktop viewports
 */
export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.TABLET;
  const isTablet = width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.DESKTOP;
  const isDesktop = width >= BREAKPOINTS.DESKTOP;

  return {
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
  };
}
