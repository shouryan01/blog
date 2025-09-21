'use client';

import { useState } from 'react';
import { SeriesFilters } from '../../components/series/series-filters';
import { SeriesCard } from '../../components/series/series-card';
import { SeriesFragment } from '../../generated/graphql';

type Props = {
  series: SeriesFragment[];
};

export function SeriesClient({ series }: Props) {
  const [filteredSeries, setFilteredSeries] = useState(series);

  return (
    <>
      <SeriesFilters series={series} onFilter={setFilteredSeries} />

      {filteredSeries.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {filteredSeries.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400">
          {series.length > 0
            ? 'No series match your search criteria.'
            : 'No series found. Create your first series in the Hashnode dashboard.'}
        </p>
      )}
    </>
  );
}
