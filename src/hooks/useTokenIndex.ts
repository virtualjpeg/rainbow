import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { isEmpty, map } from 'lodash';
import { useCallback } from 'react';
import { queryCache, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEFI_PULSE_FROM_STORAGE,
  saveDefiPulse,
} from '../handlers/localstorage/defiPulse';
import { web3Provider } from '../handlers/web3';
import { emitAssetRequest } from '../redux/explorer';
import { AppState } from '../redux/store';
import { IndexToken } from '@rainbow-me/entities';
import {
  DEFI_SDK_ADAPTER_REGISTRY_ADDRESS,
  defiSdkAdapterRegistryABI,
  DPI_ADDRESS,
} from '@rainbow-me/references';

interface ProtocolNames {
  [address: string]: string;
}
const protocolNames: ProtocolNames = {
  [DPI_ADDRESS]: 'SetToken V2',
  [DPI_ADDRESS]: 'SetToken V2',
};

interface Token {
  amount: BigNumber;
  metadata: {
    token: string;
    decimals: number;
    name: string;
    symbol: string;
  };
}

const getTokenData = (token: Token): IndexToken => {
  return {
    address: token?.metadata?.token,
    amount: token?.amount?.toString(),
    decimals: token?.metadata?.decimals,
    name: token?.metadata?.name,
    symbol: token?.metadata?.symbol,
  };
};

export default function useTokenIndex(tokenIndexAddress: string) {
  const dispatch = useDispatch();
  const { genericAssets } = useSelector(
    ({ data: { genericAssets } }: AppState) => ({
      genericAssets,
    })
  );

  const fetchDPIData = useCallback(async () => {
    const adapterRegistry = new Contract(
      DEFI_SDK_ADAPTER_REGISTRY_ADDRESS,
      defiSdkAdapterRegistryABI,
      web3Provider
    );
    const result = await adapterRegistry.getFinalFullTokenBalance(
      protocolNames[tokenIndexAddress],
      tokenIndexAddress
    );

    const tokenIndexData = {
      base: getTokenData(result.base),
      underlying: map(result.underlying, token => getTokenData(token)),
    };

    const underlyingAddresses = tokenIndexData.underlying.map(
      token => token.address
    );

    dispatch(emitAssetRequest(underlyingAddresses));
    // if (tokenIndexAddress === DPI_ADDRESS) {
    saveDefiPulse(tokenIndexData);
    // }
    return tokenIndexData;
  }, [dispatch, tokenIndexAddress]);

  const { data } = useQuery(
    !isEmpty(genericAssets) && [`tokenIndexData${tokenIndexAddress}`],
    fetchDPIData
  );

  return data || queryCache.getQueryData(DEFI_PULSE_FROM_STORAGE);
}
