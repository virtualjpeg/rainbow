import React from 'react';
import styled from '@terrysahaidak/style-thing';
import { OpacityToggler } from '../animations';
import { CoinRowHeight } from '../coin-row';
import { useFrameDelayedValue, useOpenSmallBalances } from '@rainbow-me/hooks';

const Container = styled(OpacityToggler).attrs(({ isVisible }) => ({
  pointerEvents: isVisible ? 'none' : 'auto',
}))({
  height: ({ numberOfRows }) => numberOfRows * CoinRowHeight,
  marginTop: 13,
});

export default function SmallBalancesWrapper({ assets = [] }) {
  const { isSmallBalancesOpen } = useOpenSmallBalances();
  // wait until refresh of RLV
  const delayedIsSmallBalancesOpen =
    useFrameDelayedValue(isSmallBalancesOpen) && isSmallBalancesOpen;

  return (
    <Container
      isVisible={!delayedIsSmallBalancesOpen}
      numberOfRows={assets.length}
    >
      {assets}
    </Container>
  );
}
