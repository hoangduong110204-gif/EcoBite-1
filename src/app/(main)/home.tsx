import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { AppText, EmptyState, ErrorState, Icon, Screen, SearchBar, Skeleton } from '@/components/common';
import { PopularBagCard } from '@/components/food-bag';
import { HomeHeader, HomeSectionHeader, ImpactBanner } from '@/components/home';
import { CategoryButton, HeroBanner, NearbyRestaurantCard } from '@/components/restaurant';
import { Colors, HomeLayout, Radius, Spacing } from '@/constants';
import { APP_CITY } from '@/constants/policy';
import { useFavorites, useHome } from '@/features/discovery';
import { getFoodBagImage, getHomeHeroImage, getRestaurantImage } from '@/media/images';
import { ALL_CATEGORY_ID } from '@/utils/restaurant-listing';

const ROW_GAP = 12;

/**
 * 06 Home (reference 3.1, redesigned to the provided Home reference): header, hero with a
 * real food photo, search bar, six illustrated categories, "Nhà hàng gần bạn" (horizontal
 * photo cards), "Phổ biến hôm nay" (horizontal bag cards) and the impact banner. All data
 * comes from `useHome`; nothing here filters or sorts.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { area, homeCategories, categoryId, setCategoryId, restaurants, popularBags, status, reload } = useHome();
  const favorites = useFavorites();

  const openRestaurant = (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } });
  const openBag = (id: string) => router.push({ pathname: '/food-bag/[id]', params: { id } });
  const openSearch = () => router.push('/search');

  return (
    <View style={{ flex: 1 }}>
      <Screen padded={false} scroll={false}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: HomeLayout.bottomPadding }}>
          <HomeHeader />

          <View style={{ paddingHorizontal: HomeLayout.gutter }}>
            <HeroBanner image={getHomeHeroImage()} />
          </View>
          <SearchBar
            placeholder="Tìm kiếm món ăn, nhà hàng..."
            rightIcon="filter"
            onPress={openSearch}
            style={{ marginHorizontal: HomeLayout.gutter, marginTop: 14, borderRadius: Radius.pill }}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: HomeLayout.gutter, paddingTop: 16, paddingBottom: 2, gap: Spacing.xs }}>
            {homeCategories.map(({ category, icon }) => (
              <View key={category.id} style={{ width: 68, flexDirection: 'row' }}>
                <CategoryButton label={category.name} icon={icon} selected={category.id === categoryId} onPress={() => setCategoryId(category.id)} />
              </View>
            ))}
          </ScrollView>

          <View style={{ paddingTop: HomeLayout.sectionGap, gap: 10 }}>
            <View style={{ paddingHorizontal: HomeLayout.gutter, gap: 3 }}>
              <HomeSectionHeader title="Nhà hàng gần bạn" actionLabel="Xem tất cả" onActionPress={openSearch} />
              <View accessibilityLabel={`Khu vực: ${area?.name ?? APP_CITY}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="pin" size={12} color={Colors.primary} />
                <AppText variant="caption" color="textMuted" style={{ fontSize: 11 }}>
                  {area ? `${area.name}, ${area.city}` : APP_CITY} · bạn tự đến quán nhận túi
                </AppText>
              </View>
            </View>

            {status === 'loading' ? (
              <View style={{ flexDirection: 'row', gap: ROW_GAP, paddingHorizontal: HomeLayout.gutter }}>
                {[0, 1].map((i) => (
                  <Skeleton key={i} width={HomeLayout.restaurantCardWidth} height={250} radius={Radius.card} />
                ))}
              </View>
            ) : status === 'error' ? (
              <View style={{ minHeight: 280, paddingHorizontal: HomeLayout.gutter }}>
                <ErrorState
                  title="Không tải được nhà hàng"
                  message="Kiểm tra kết nối rồi thử lại nhé."
                  primaryAction={{ label: 'Thử lại', onPress: reload }}
                />
              </View>
            ) : restaurants.length === 0 ? (
              <View style={{ minHeight: 300, paddingHorizontal: HomeLayout.gutter }}>
                <EmptyState
                  title="Chưa có nhà hàng nào"
                  message="Danh mục này chưa có nhà hàng có túi hôm nay. Thử danh mục khác nhé."
                  primaryAction={{ label: 'Xem tất cả nhà hàng', onPress: () => setCategoryId(ALL_CATEGORY_ID) }}
                />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: HomeLayout.gutter, paddingVertical: 4, gap: ROW_GAP }}>
                {restaurants.map(({ restaurant, featuredBag, pickupWindowLabel, soldOut }) => (
                  <NearbyRestaurantCard
                    key={restaurant.id}
                    name={restaurant.name}
                    art={restaurant.art}
                    image={getRestaurantImage(restaurant.id)}
                    rating={restaurant.rating}
                    ratingCount={restaurant.ratingCount}
                    distanceKm={restaurant.distanceKm}
                    walkMinutes={restaurant.walkMinutes}
                    pickupWindowLabel={pickupWindowLabel}
                    price={featuredBag?.price}
                    originalPrice={featuredBag?.originalPrice}
                    soldOut={soldOut}
                    favorite={favorites.isFavorite('restaurant', restaurant.id)}
                    onToggleFavorite={() => favorites.toggle('restaurant', restaurant.id)}
                    onPress={() => openRestaurant(restaurant.id)}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {status === 'ready' && popularBags.length > 0 ? (
            <View style={{ paddingTop: HomeLayout.sectionGap, gap: 10 }}>
              <View style={{ paddingHorizontal: HomeLayout.gutter }}>
                <HomeSectionHeader title="Phổ biến hôm nay" actionLabel="Xem tất cả" onActionPress={openSearch} />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: HomeLayout.gutter, paddingVertical: 4, gap: ROW_GAP - 2 }}>
                {popularBags.map(({ bag, restaurant }) => (
                  <PopularBagCard
                    key={bag.id}
                    name={bag.name}
                    summary={bag.summary}
                    restaurantName={restaurant.name}
                    rating={restaurant.rating}
                    art={bag.art}
                    image={getFoodBagImage(bag.id)}
                    price={bag.price}
                    originalPrice={bag.originalPrice}
                    favorite={favorites.isFavorite('food-bag', bag.id)}
                    onToggleFavorite={() => favorites.toggle('food-bag', bag.id)}
                    onPress={() => openBag(bag.id)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={{ paddingHorizontal: HomeLayout.gutter, paddingTop: HomeLayout.sectionGap }}>
            <ImpactBanner onPress={() => router.navigate('/account')} />
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
}
