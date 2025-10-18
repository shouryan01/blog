'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchClient } from '../search/search-client';
import { HomeClient } from '../home-client';
import { PageInfoFragment, PostFragment, PublicationFragment } from '../../generated/graphql';
import { TagFilter } from '../../components/tag-filter';
import { HistoryFilter } from '../../components/history-filter';

type Props = {
    publication: PublicationFragment;
    initialPosts: PostFragment[];
    initialPageInfo: PageInfoFragment;
};

export default function SearchAndListClient({ publication, initialPosts, initialPageInfo }: Props) {
    const [query, setQuery] = useState('');
    const searchParams = useSearchParams();
    const selectedTag = searchParams.get('tag');

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                    <SearchClient
                        publication={publication}
                        navigateOnSubmit={false}
                        disableResults
                        onQueryChange={setQuery}
                    />
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <TagFilter selectedTag={selectedTag} />
                    <HistoryFilter />
                </div>
            </div>
            <HomeClient initialPosts={initialPosts} initialPageInfo={initialPageInfo} filterQuery={query} filterTag={selectedTag} />
        </>
    );
}


