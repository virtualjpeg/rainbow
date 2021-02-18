import React from 'react';
import { magicMemo } from '../../utils';
import { CoinIcon } from '../coin-icon';
import { Row } from '../layout';
import { Text } from '../text';

const UnderlyingCoinIconSize = 20;

const UnderlyingAssetCoinRow = ({
  address,
  change,
  isPositive,
  name,
  symbol,
}) => {
  const { colors } = useTheme();

  return (
    <Row marginBottom={19}>
      <Row align="start" justify="start" marginRight={6} marginTop={2}>
        <CoinIcon
          address={address}
          size={UnderlyingCoinIconSize}
          symbol={symbol}
        />
      </Row>
      <Row marginRight={23}>
        <Text
          color={colors.alpha(colors.blueGreyDark, 0.7)}
          size="large"
          weight="medium"
        >
          {name}{' '}
          <Text
            color={isPositive ? colors.green : colors.brightRed}
            letterSpacing="roundedTight"
            size="smedium"
          >
            {isPositive ? `↑` : `↓`} {change}
          </Text>
        </Text>
      </Row>
    </Row>
  );
};

export default magicMemo(UnderlyingAssetCoinRow, ['change', 'name', 'price']);
