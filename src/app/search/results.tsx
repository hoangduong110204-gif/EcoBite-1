import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { getRestaurantImage } from '@/media/images';
import { AppText, Button, EmptyState, ErrorState, Header, Screen, SearchBar, Skeleton } from '@/components/common';
import { RestaurantListCard } from '@/components/restaurant';
import { SearchControls, SearchFilterSheet, SearchSortSheet } from '@/components/search';
import { Radius, Spacing } from '@/constants';
import { rememberSearch, useSearch } from '@/features/discovery';
import { useBack } from '@/hooks';
import { formatDistance } from '@/utils/format';
import type { SearchResult } from '@/utils/search';
import {
  SEARCH_DISTANCE_OPTIONS,
  SEARCH_PRICE_RANGES,
  SEARCH_SORT_OPTIONS,
  TOP_RATED_MIN,
  countActiveFilters,
  emptySearchFilters,
  type SearchFilters,
  type SearchSort,
} from '@/utils/search-refine';

const subtitleOf = ({ listing, matchedBy, matchedBags }: SearchResult): string => {
  const distance = formatDistance(listing.restaurant.distanceKm);
  if (listing.soldOut) return `${listing.categoryName} · ${distance}`;
  const bagHint = !matchedBy.includes('name') && matchedBags[0] ? `Có ${matchedBags[0].name.toLowerCase()} trong túi` : `Còn ${listing.availableCount} túi`;
  const window = listing.pickupWindowLabel ? ` · nhận ${listing.pickupWindowLabel}` : '';
  return `${bagHint} · ${distance}${window}`;
};

const DISTANCE_OPTIONS = SEARCH_DISTANCE_OPTIONS.map((o) => ({ key: o.km, label: o.label }));
const PRICE_OPTIONS = SEARCH_PRICE_RANGES.map((o) => ({ key: o.key, label: o.label }));

/** 3.5 Search Results: `?q=` query, control row (Bộ lọc · sort · Còn túi), result rows, no-result state. Local filtering only. */
export default function SearchResultsScreen() {
  const router = useRouter();
  const goBack = useBack('/search');
  const params = useLocalSearchParams<{ q?: string }>();
  const query = (params.q ?? '').trim();
  const [text, setText] = useState(query);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(emptySearchFilters);
  const [sort, setSort] = useState<SearchSort>('relevance');
  const [sheet, setSheet] = useState<'filter' | 'sort' | null>(null);
  const { results, status, reload } = useSearch(query, { onlyAvailable, filters, sort });

  const filterCount = countActiveFilters(filters);
  const refined = onlyAvailable || filterCount > 0;
  const sortLabel = SEARCH_SORT_OPTIONS.find((o) => o.key === sort)?.label ?? 'Phù hợp nhất';
  const resetRefinements = () => {
    setOnlyAvailable(false);
    setFilters(emptySearchFilters);
  };

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    rememberSearch(value);
    router.setParams({ q: value });
  };

  return (
    <Screen
      header={
        <Header
          onBack={goBack}
          titleNode={
            <View style={{ flex: 1 }}>
              <SearchBar
                value={text}
                onChangeText={setText}
                onSubmit={submit}
                onClear={() => {
                  setText('');
                  router.replace('/search');
                }}
              />
            </View>
          }
        />
      }>
      {status === 'error' ? (
        <ErrorState
          title="Không tải được kết quả"
          message="Kiểm tra kết nối rồi thử lại nhé."
          primaryAction={{ label: 'Thử lại', onPress: reload }}
        />
      ) : status === 'loading' ? (
        <View style={{ gap: Spacing.s11 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={94} radius={Radius.card} />
          ))}
        </View>
      ) : (
        <View style={{ flex: 1, gap: Spacing.s11 }}>
          <SearchControls
            filterCount={filterCount}
            sortLabel={sortLabel}
            sortActive={sort !== 'relevance'}
            onlyAvailable={onlyAvailable}
            onOpenFilter={() => setSheet('filter')}
            onOpenSort={() => setSheet('sort')}
            onToggleAvailable={() => setOnlyAvailable((v) => !v)}
          />
          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title={query ? `Không tìm thấy “${query}”` : 'Nhập từ khoá để tìm kiếm'}
              message={
                refined
                  ? 'Không có nhà hàng khớp từ khoá và bộ lọc hiện tại. Bỏ bớt bộ lọc để xem thêm quán.'
                  : 'Thử tên món, tên nhà hàng hoặc loại món khác nhé.'
              }
              primaryAction={refined ? { label: 'Xoá bộ lọc', onPress: resetRefinements } : { label: 'Tìm từ khoá khác', onPress: () => router.replace('/search') }}
              secondaryAction={{ label: 'Nhờ AI gợi ý', icon: 'leaf', onPress: () => router.push('/ai') }}
            />
          ) : (
            <>
              <AppText variant="caption" color="textMuted">
                <AppText variant="label">{results.length} kết quả</AppText> cho “{query}”
              </AppText>
              {results.map((result) => (
                <RestaurantListCard
                  key={result.listing.restaurant.id}
                  name={result.listing.restaurant.name}
                  art={result.listing.restaurant.art}
                  image={getRestaurantImage(result.listing.restaurant.id)}
                  subtitle={subtitleOf(result)}
                  price={result.listing.featuredBag?.price}
                  originalPrice={result.listing.featuredBag?.originalPrice}
                  soldOut={result.listing.soldOut}
                  onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: result.listing.restaurant.id } })}
                />
              ))}
              <Button
                label="Nhờ AI gợi ý món tương tự"
                variant="secondary"
                icon="leaf"
                onPress={() => router.push('/ai')}
                style={{ marginTop: Spacing.xs, marginBottom: Spacing.xl }}
              />
            </>
          )}
        </View>
      )}

      <SearchSortSheet
        visible={sheet === 'sort'}
        options={SEARCH_SORT_OPTIONS}
        value={sort}
        onSelect={(key) => {
          setSort(key);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <SearchFilterSheet
        visible={sheet === 'filter'}
        priceOptions={PRICE_OPTIONS}
        distanceOptions={DISTANCE_OPTIONS}
        price={filters.priceRange}
        distanceKm={filters.maxDistanceKm}
        topRatedOnly={filters.topRatedOnly}
        topRatedLabel={`Đánh giá từ ${TOP_RATED_MIN.toString().replace('.', ',')} sao`}
        resultCount={results.length}
        onPrice={(priceRange) => setFilters((f) => ({ ...f, priceRange }))}
        onDistance={(maxDistanceKm) => setFilters((f) => ({ ...f, maxDistanceKm }))}
        onTopRated={(topRatedOnly) => setFilters((f) => ({ ...f, topRatedOnly }))}
        onReset={() => setFilters(emptySearchFilters)}
        onClose={() => setSheet(null)}
      />
    </Screen>
  );
}
