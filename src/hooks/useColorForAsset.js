import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import useImageMetadata from './useImageMetadata';
import { colors_NOT_REACTIVE } from '@rainbow-me/styles';
import {
  getTokenMetadata,
  getUrlForTrustIconFallback,
  isETH,
  pseudoRandomArrayItemFromString,
} from '@rainbow-me/utils';

export default function useColorForAsset(asset, fallbackColor) {
  const { address, color } = asset;
  const { isDarkMode, colors } = useTheme();

  const token = getTokenMetadata(address);
  const tokenListColor = token?.color;

  const { color: imageColor } = useImageMetadata(
    getUrlForTrustIconFallback(address)
  );

  const colorDerivedFromAddress = useMemo(
    () =>
      isETH(address)
        ? colors_NOT_REACTIVE.dark
        : pseudoRandomArrayItemFromString(
            address,
            colors_NOT_REACTIVE.avatarColor
          ),
    [address]
  );

  return useMemo(() => {
    if (color)
      return isDarkMode && colors.isColorDark(color)
        ? colors.brighten(color)
        : color;
    if (tokenListColor) return tokenListColor;
    if (imageColor) return imageColor;
    if (fallbackColor) return fallbackColor;
    return colorDerivedFromAddress;
  }, [
    colors,
    isDarkMode,
    color,
    colorDerivedFromAddress,
    fallbackColor,
    imageColor,
    tokenListColor,
  ]);
}
