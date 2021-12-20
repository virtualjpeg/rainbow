import { isNil } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const accountAssetsDataSelector = state => state.data.accountAssetsData;
const assetPricesFromUniswapSelector = state =>
  state.data.assetPricesFromUniswap;
const uniqueIdSelector = (_, uniqueId) => uniqueId;

const accountAssetDataSelector = createSelector(
  accountAssetsDataSelector,
  uniqueIdSelector,
  (accountAssetsData, uniqueId) => accountAssetsData?.[uniqueId]
);

const assetPriceFromUniswapSelector = createSelector(
  assetPricesFromUniswapSelector,
  uniqueIdSelector,
  (assetPricesFromUniswap, uniqueId) => assetPricesFromUniswap?.[uniqueId]
);

const assetUniswapPriceSelector = createSelector(
  assetPriceFromUniswapSelector,
  assetPriceFromUniswap => assetPriceFromUniswap?.price
);

const assetUniswapRelativeChangeSelector = createSelector(
  assetPriceFromUniswapSelector,
  assetPriceFromUniswap => assetPriceFromUniswap?.relativePriceChange
);

const makeAccountAssetSelector = () =>
  createSelector(
    accountAssetDataSelector,
    assetUniswapPriceSelector,
    assetUniswapRelativeChangeSelector,
    (accountAsset, assetUniswapPrice, assetUniswapRelativeChange) => {
      if (!accountAsset) return null;
      if (isNil(accountAsset?.price) && assetUniswapPrice) {
        return {
          ...accountAsset,
          price: {
            relative_change_24h: assetUniswapRelativeChange,
            value: assetUniswapPrice,
          },
        };
      }
      return accountAsset;
    }
  );

// this is meant to be used for assets under balances
// NFTs are not included in this hook
export default function useAccountAsset(uniqueId) {
  const selectAccountAsset = useMemo(makeAccountAssetSelector, []);
  const asset = useSelector(state => selectAccountAsset(state, uniqueId));
  return asset;
}
