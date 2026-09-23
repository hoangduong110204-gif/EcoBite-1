import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { getRestaurantImage } from '@/media/images';
import { AppText, Button, Card, Chip, EmptyState, Header, Icon, ListRow, Screen, SearchBar } from '@/components/common';
import { RestaurantListCard } from '@/components/restaurant';
import { Colors, Spacing } from '@/constants';
import {
  clearRecentSearches,
  forgetSearch,
  rememberSearch,
  TRENDING_SEARCHES,
  useRecentSearches,
  useSearch,
} from '@/features/discovery';
import { useBack } from '@/hooks';
import { formatDistance } from '@/utils/format';

const MAX_SUGGESTIONS = 4;
const LABEL = { letterSpacing: 0.7, textTransform: 'uppercase' } as const;

/**
 * 3.4 Search: empty (recent + trending), active (live matches while typing),
 * then Search Results on submit. Filtering is local (`utils/search`).
 */
export default function SearchScreen() {
  const router = useRouter();
  const goBack = useBack('/home');
  const [text, setText] = useState('');
  const recent = useRecentSearches();
  const query = text.trim();
  const { results } = useSearch(query);

  const submit = (q: string) => {
    const value = q.trim();
    if (!value) return;
    rememberSearch(value);
    router.push({ pathname: '/search/results', params: { q: value } });
  };

  return (
    <Screen
      header={
        <Header
          onBack={goBack}
          titleNode={
            <View style={{ flex: 1 }}>
              <SearchBar value={text} onChangeText={setText} onSubmit={() => submit(text)} onClear={() => setText('')} autoFocus />
            </View>
          }
        />
      }>
      {query ? (
        results.length === 0 ? (
          <EmptyState
            icon="search"
            title={`Không tìm thấy “${query}”`}
            message="Thử tên món, tên nhà hàng hoặc loại món khác nhé."
            secondaryAction={{ label: 'Xoá từ khoá', onPress: () => setText('') }}
          />
        ) : (
          <View style={{ gap: Spacing.s11 }}>
            {results.slice(0, MAX_SUGGESTIONS).map(({ listing }) => (
              <RestaurantListCard
                key={listing.restaurant.id}
                name={listing.restaurant.name}
                art={listing.restaurant.art}
                image={getRestaurantImage(listing.restaurant.id)}
                subtitle={`${listing.categoryName} · ${formatDistance(listing.restaurant.distanceKm)}`}
                price={listing.featuredBag?.price}
                originalPrice={listing.featuredBag?.originalPrice}
                soldOut={listing.soldOut}
                onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: listing.restaurant.id } })}
              />
            ))}
            <Button label={`Xem tất cả kết quả cho “${query}”`} variant="soft" icon="search" onPress={() => submit(text)} />
          </View>
        )
      ) : (
        <View style={{ paddingBottom: Spacing.xl }}>
          {recent.length > 0 ? (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.xs }}>
                <AppText variant="label" color="textMuted" style={LABEL}>
                  Tìm gần đây
                </AppText>
                <Pressable accessibilityRole="button" hitSlop={8} onPress={clearRecentSearches}>
                  <AppText variant="label" color="primaryDark">
                    Xoá hết
                  </AppText>
                </Pressable>
              </View>
              {recent.map((item, i) => (
                <ListRow
                  key={item}
                  icon="clock"
                  title={item}
                  divider={i > 0}
                  onPress={() => {
                    setText(item);
                    submit(item);
                  }}
                  trailing={
                    <Pressable accessibilityRole="button" accessibilityLabel={`Xoá “${item}”`} hitSlop={10} onPress={() => forgetSearch(item)}>
                      <Icon name="close" size={15} color={Colors.textFaint} />
                    </Pressable>
                  }
                />
              ))}
            </View>
          ) : null}

          <AppText variant="label" color="textMuted" style={[LABEL, { marginTop: Spacing.s20 }]}>
            Đang tìm nhiều
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.s11 }}>
            {TRENDING_SEARCHES.map((t) => (
              <Chip
                key={t}
                label={t}
                soft
                onPress={() => {
                  setText(t);
                  submit(t);
                }}
              />
            ))}
          </View>

          <AppText variant="label" color="textMuted" style={[LABEL, { marginTop: 22 }]}>
            Gợi ý cho bạn
          </AppText>
          <Card variant="mint" style={{ marginTop: Spacing.s11, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Icon name="search" size={20} color={Colors.primaryDark} />
            <AppText variant="caption" color="primaryText" style={{ flex: 1, lineHeight: 17 }}>
              Gõ tên nhà hàng, loại món hoặc tên túi, ví dụ <AppText variant="label" color="primaryText">“bún bò”</AppText>.
            </AppText>
          </Card>
        </View>
      )}
    </Screen>
  );
}
