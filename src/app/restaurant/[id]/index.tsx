import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import {
  AppText,
  BottomActionBar,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  CoverImage,
  Header,
  Icon,
  Screen,
  SectionHeader,
  Skeleton,
} from '@/components/common';
import { getFoodBagImage, getRestaurantImage } from '@/media/images';
import { FoodBagCard } from '@/components/food-bag';
import { PickupInfoTiles, RestaurantHeader } from '@/components/restaurant';
import { Colors, Radius, Sizes, Spacing } from '@/constants';
import { getPrimaryBag, orderBagsForDetail, useRestaurant } from '@/features/restaurant';
import { useBack } from '@/hooks';

/**
 * 08 Restaurant Detail (reference 4.1): cover, availability badge, name and
 * rating, pickup tiles, address, "Túi đang có", and a bottom button into the
 * first available bag. Directions / hearts / reviews are separate reference
 * screens that are not part of this phase.
 */
export default function RestaurantDetailScreen() {
  const router = useRouter();
  const goBack = useBack('/home');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listing, status, reload } = useRestaurant(id);

  if (status === 'not_found' || status === 'error') {
    return (
      <Screen header={<Header title="Nhà hàng" onBack={goBack} />}>
        {status === 'not_found' ? (
          <EmptyState
            icon="search"
            title="Không tìm thấy nhà hàng"
            message="Nhà hàng này không còn tồn tại hoặc đường dẫn không đúng."
            primaryAction={{ label: 'Về trang chủ', onPress: () => router.replace('/home') }}
            secondaryAction={{ label: 'Tìm kiếm', icon: 'search', onPress: () => router.replace('/search') }}
          />
        ) : (
          <ErrorState
            title="Không tải được nhà hàng"
            message="Kiểm tra kết nối rồi thử lại nhé."
            primaryAction={{ label: 'Thử lại', onPress: reload }}
            secondaryAction={{ label: 'Về trang chủ', onPress: () => router.replace('/home') }}
          />
        )}
      </Screen>
    );
  }

  if (status === 'loading' || !listing) {
    return (
      <Screen header={<Header title="Nhà hàng" onBack={goBack} />}>
        <View style={{ gap: Spacing.s14 }}>
          <Skeleton height={Sizes.restaurantCover / 1.6} radius={Radius.card} />
          <Skeleton width="60%" height={24} />
          <Skeleton width="80%" height={14} />
          <Skeleton height={64} radius={Radius.lg} />
        </View>
      </Screen>
    );
  }

  const { restaurant, categoryName, availableCount, pickupWindowLabel, soldOut } = listing;
  const bags = orderBagsForDetail(listing.bags);
  const primaryBag = getPrimaryBag(listing);
  const [street, ...rest] = restaurant.address.split(', ');

  return (
    <Screen
      edgeToEdge
      padded={false}
      footer={
        <BottomActionBar>
          <Button
            label={primaryBag ? 'Chọn túi ngay' : 'Hết túi hôm nay'}
            disabled={!primaryBag}
            onPress={() => primaryBag && router.push({ pathname: '/food-bag/[id]', params: { id: primaryBag.id } })}
          />
        </BottomActionBar>
      }>
      <View>
        <CoverImage
          art={restaurant.art}
          image={getRestaurantImage(restaurant.id)}
          height={Sizes.restaurantCover}
          onBack={goBack}
          badge={<Badge label={soldOut ? 'Hết túi hôm nay' : `Còn ${availableCount} túi hôm nay`} tone={soldOut ? 'gray' : 'solid'} />}
        />

        <View style={{ paddingHorizontal: Spacing.s20, paddingTop: Spacing.lg, gap: Spacing.s14, paddingBottom: Spacing.xl }}>
          <RestaurantHeader
            name={restaurant.name}
            rating={restaurant.rating}
            ratingCount={restaurant.ratingCount}
            distanceKm={restaurant.distanceKm}
            subtitle={categoryName}
          />
          <PickupInfoTiles pickupWindowLabel={pickupWindowLabel} walkMinutes={restaurant.walkMinutes} />

          <Card style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.s11 }}>
            <Icon name="pin" size={19} color={Colors.primary} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="bodyStrong" style={{ fontSize: 12 }}>
                {street}
              </AppText>
              {rest.length > 0 ? (
                <AppText variant="caption" color="textMuted">
                  {rest.join(', ')}
                </AppText>
              ) : null}
            </View>
          </Card>

          <View style={{ gap: Spacing.s11 }}>
            <SectionHeader title="Túi đang có" />
            {bags.length === 0 ? (
              <AppText variant="muted">Nhà hàng chưa mở túi nào hôm nay.</AppText>
            ) : (
              bags.map((bag) => (
                <FoodBagCard
                  key={bag.id}
                  bag={bag}
                  image={getFoodBagImage(bag.id)}
                  showPickupWindow
                  onPress={() => router.push({ pathname: '/food-bag/[id]', params: { id: bag.id } })}
                />
              ))
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
}
