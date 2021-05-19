import { chunk, sortBy, times, toLower } from 'lodash';
import React, { useCallback, useContext } from 'react';
import { Animated, Text, View } from 'react-native';
import SortableGrid from 'react-native-sortable-grid';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeNavigatorContext } from '../../navigation/SwipeNavigator';
import { setOpenFamilyTabs } from '../../redux/openStateSettings';
import { useAnimatedValue } from '../../screens/WelcomeScreen';
import { UniqueTokenRow } from '../unique-token';
import TokenFamilyWrap from './TokenFamilyWrap';

const CollectibleTokenFamily = ({
  external,
  familyId,
  familyImage,
  familyName,
  showcase,
  item,
  ...props
}) => {
  const dispatch = useDispatch();
  const isShowcase = familyName === 'Showcase';
  console.log(isShowcase && item);

  const isFamilyOpen = useSelector(
    ({ openStateSettings }) =>
      openStateSettings.openFamilyTabs[
        familyName + (showcase ? '-showcase' : '')
      ]
  );

  const handleToggle = useCallback(
    () =>
      dispatch(
        setOpenFamilyTabs({
          index: familyName + (showcase ? '-showcase' : ''),
          state: !isFamilyOpen,
        })
      ),
    [dispatch, familyName, isFamilyOpen, showcase]
  );
  const itemUnwrapped = item;

  const renderChild = useCallback(
    i => (
      <UniqueTokenRow
        external={external}
        item={itemUnwrapped[i]}
        key={`${familyName}_${i}`}
      />
    ),
    [external, familyName, itemUnwrapped]
  );

  const setSwipeEnabled = useContext(SwipeNavigatorContext);

  const value = useAnimatedValue(0).current;

  const startCustomAnimation = useCallback(() => {
    console.log('Custom animation started!');

    Animated.timing(value, {
      toValue: 100,
      duration: 500,
    }).start(() => {
      Animated.timing(value, {
        toValue: 0,
        duration: 500,
      }).start();
    });
  }, [value]);
  return isShowcase ? (
    <SortableGrid
      dragStartAnimation={{
        transform: [
          {
            scale: value.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 1.05],
            }),
          },
        ],
      }}
      onDragRelease={() => setSwipeEnabled(true)}
      onDragStart={() => {
        setSwipeEnabled(false);
        startCustomAnimation();
      }}
    >
      {['a', 'b', 'c'].map((letter, index) => (
        <View key={index}>
          <Text>{letter}</Text>
        </View>
      ))}
    </SortableGrid>
  ) : (
    <TokenFamilyWrap
      {...props}
      familyId={familyId}
      familyImage={familyImage}
      isOpen={isFamilyOpen}
      item={itemUnwrapped}
      onToggle={handleToggle}
      renderItem={renderChild}
      title={familyName}
    >
      {times(item.length, renderChild)}
    </TokenFamilyWrap>
  );
};

export default React.memo(CollectibleTokenFamily);
