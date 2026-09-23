import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import {
  AppText,
  Badge,
  BottomActionBar,
  Button,
  Card,
  CoverImage,
  EmptyState,
  ErrorState,
  Header,
  IconTile,
  ListRow,
  Screen,
  SectionHeader,
  Skeleton,
} from '@/components/common';
import { getFoodBagImage, getRestaurantImage } from '@/media/images';
import { BagContentsList, BagImpactTiles, FoodBagPrice } from '@/components/food-bag';
import { RestaurantListCard } from '@/components/restaurant';
import { Radius, Sizes, Spacing } from '@/constants';
import { IMPACT_PER_BAG } from '@/constants/policy';
import { getBagAvailability, getStockLabel, summarizeAllergens, useFoodBag } from '@/features/food-bag';
import { useBack } from '@/hooks';
import { calcDiscountPercent, formatDistance, formatKg, formatMoney } from '@/utils/format';

const CAPTION_UPPER = { letterSpacing: 0.6, textTransform: 'uppercase' } as const;

/**
 * 09 Food Bag Detail (reference 5.1) and its sold-out state (5.7). Adding goes
 * through the Add-to-Cart sheet (`/food-bag/[id]/add-to-cart`), which owns the
 * quantity and the cart update. Contents / allergens / impact sub-screens
 * (5.2, 5.4, 5.5) are not part of this phase, so those rows are informational.
 */
export default function FoodBagDetailScreen() {
  const router = useRouter();
  const goBack = useBack('/home');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bag, restaurant, alternatives, status, reload } = useFoodBag(id);

  if (status === 'not_found' || status === 'error') {
    return (
      <Screen header={<Header title="Chi tiết túi" onBack={goBack} />}>
        {status === 'not_found' ? (
          <EmptyState
            title="Không tìm thấy túi này"
            message="Túi này không còn tồn tại hoặc đường dẫn không đúng."
            primaryAction={{ label: 'Về trang chủ', onPress: () => router.replace('/home') }}
            secondaryAction={{ label: 'Tìm kiếm', icon: 'search', onPress: () => router.replace('/search') }}
          />
        ) : (
          <ErrorState
            title="Không tải được túi"
            message="Kiểm tra kết nối rồi thử lại nhé."
            primaryAction={{ label: 'Thử lại', onPress: reload }}
            secondaryAction={{ label: 'Về trang chủ', onPress: () => router.replace('/home') }}
          />
        )}
      </Screen>
    );
  }

  if (status === 'loading' || !bag || !restaurant) {
    return (
      <Screen header={<Header title="Chi tiết túi" onBack={goBack} />}>
        <View style={{ gap: Spacing.s14 }}>
          <Skeleton height={Sizes.bagCover / 1.6} radius={Radius.card} />
          <Skeleton width="50%" height={14} />
          <Skeleton width="70%" height={24} />
          <Skeleton height={60} radius={Radius.lg} />
        </View>
      </Screen>
    );
  }

  const openRestaurant = (restaurantId: string) => router.push({ pathname: '/restaurant/[id]', params: { id: restaurantId } });

  // 5.7 — sold out: never a dead end (other bags of the restaurant, alternatives, AI).
  if (getBagAvailability(bag) === 'sold_out') {
    return (
      <Screen
        header={<Header title="Chi tiết túi" onBack={goBack} />}
        footer={
          <BottomActionBar>
            <Button label="Nhờ AI tìm túi thay thế" variant="secondary" icon="leaf" onPress={() => router.push('/ai')} />
          </BottomActionBar>
        }>
        <View style={{ gap: Spacing.s18, paddingBottom: Spacing.xl }}>
          <View style={{ minHeight: 320 }}>
            <EmptyState
              icon="box"
              title="Túi này đã hết hôm nay"
              message={`${bag.name} của ${restaurant.name} không còn túi nào để đặt. Bạn có thể xem các túi khác của quán.`}
              primaryAction={{ label: `Xem quán ${restaurant.name}`, onPress: () => openRestaurant(restaurant.id) }}
            />
          </View>
          {alternatives.length > 0 ? (
            <View style={{ gap: Spacing.s11 }}>
              <SectionHeader title="Vẫn còn túi ở gần bạn" />
              {alternatives.map(({ restaurant: r, featuredBag, availableCount, pickupWindowLabel }) => (
                <RestaurantListCard
                  key={r.id}
                  name={r.name}
                  art={r.art}
                  image={getRestaurantImage(r.id)}
                  subtitle={`Còn ${availableCount} túi · ${formatDistance(r.distanceKm)}${pickupWindowLabel ? ` · nhận ${pickupWindowLabel}` : ''}`}
                  price={featuredBag?.price}
                  originalPrice={featuredBag?.originalPrice}
                  onPress={() => openRestaurant(r.id)}
                />
              ))}
            </View>
          ) : null}
        </View>
      </Screen>
    );
  }

  const percent = calcDiscountPercent(bag.originalPrice, bag.price);
  return (
    <Screen
      edgeToEdge
      padded={false}
      footer={
        <BottomActionBar>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
            <View style={{ gap: 1 }}>
              <AppText variant="caption" color="textMuted">
                Giá 1 túi
              </AppText>
              <AppText variant="title" style={{ fontSize: 19, lineHeight: 24 }}>
                {formatMoney(bag.price)}
              </AppText>
            </View>
            <Button
              label="Thêm vào giỏ hàng"
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/food-bag/[id]/add-to-cart', params: { id: bag.id } })}
            />
          </View>
        </BottomActionBar>
      }>
      <CoverImage
        art={bag.art}
        image={getFoodBagImage(bag.id)}
        height={Sizes.bagCover}
        onBack={goBack}
        badge={<Badge label={getStockLabel(bag)} tone={bag.left <= 3 ? 'red' : 'solid'} />}
      />
      <View style={{ paddingHorizontal: Spacing.s20, paddingTop: Spacing.lg, gap: 15, paddingBottom: Spacing.xl }}>
        <View style={{ gap: 7 }}>
          <Pressable accessibilityRole="button" onPress={() => openRestaurant(restaurant.id)}>
            <AppText variant="label" color="primaryDark" style={CAPTION_UPPER}>
              {restaurant.name} · {formatDistance(restaurant.distanceKm)}
            </AppText>
          </Pressable>
          <AppText variant="title">{bag.name}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <FoodBagPrice price={bag.price} originalPrice={bag.originalPrice} size="lg" />
            {percent > 0 ? <Badge label={`Tiết kiệm ${percent}%`} tone="solid" /> : null}
          </View>
          <AppText variant="muted">{bag.summary}</AppText>
        </View>

        <Card variant="mint" style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <IconTile name="clock" size="xl" tone="white" iconSize={20} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong" color="primaryText" style={{ fontSize: 13 }}>
              Tới quán lấy {bag.pickupWindow.label}
            </AppText>
            <AppText variant="caption" color="primaryText" style={{ fontSize: 11 }}>
              Đặt trước, tự đến quán nhận túi.
            </AppText>
          </View>
        </Card>

        <View style={{ gap: 6 }}>
          <AppText variant="cardTitle">Trong túi thường có</AppText>
          <BagContentsList items={bag.contents} />
          <AppText variant="caption" color="textMuted" style={{ marginTop: 6, lineHeight: 18 }}>
            Món cụ thể thay đổi theo những gì bếp còn cuối ngày — đó là cách túi giữ được giá rẻ.
          </AppText>
        </View>

        <BagImpactTiles
          tiles={[
            { value: formatKg(IMPACT_PER_BAG.foodKg), label: 'thức ăn được cứu' },
            { value: formatKg(IMPACT_PER_BAG.co2Kg), label: 'CO₂ không thải ra' },
          ]}
        />

        <ListRow icon="warning" title="Nguyên liệu & dị ứng" subtitle={summarizeAllergens(bag.allergens)} divider />
      </View>
    </Screen>
  );
}
