import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ExchangeNavigatorFactory } from '../navigation/ExchangeModalNavigator';
import useStatusBarManaging from '../navigation/useStatusBarManaging';
import ExchangeModal from './ExchangeModal';
import { ExchangeModalTypes } from '@rainbow-me/entities';
import {
  createSwapAndDepositCompoundRap,
  estimateSwapAndDepositCompound,
} from '@rainbow-me/raps';

const DepositModal = ({ navigation, ...props }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  android && useStatusBarManaging();
  const { params } = useRoute();
  const defaultInputAsset = params?.defaultInputAsset;
  const underlyingPrice = params?.underlyingPrice;
  return (
    <ExchangeModal
      createRap={createSwapAndDepositCompoundRap}
      defaultInputAsset={defaultInputAsset}
      estimateRap={estimateSwapAndDepositCompound}
      inputHeaderTitle="Deposit"
      navigation={navigation}
      showOutputField={false}
      type={ExchangeModalTypes.depositCompound}
      underlyingPrice={underlyingPrice}
      {...props}
    />
  );
};

export default ExchangeNavigatorFactory(DepositModal);
