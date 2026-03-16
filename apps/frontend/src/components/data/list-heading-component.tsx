import { PageQuery } from '@servisbot/model';
import { Card } from 'flowbite-react';
import SearchQuery from './search-component';

export default function ListHeading({
  title,
  placeholder,
  onSearch,
  isSearching,
  query,
  className,
}: {
  title: string;
  placeholder: string;
  onSearch: (query: PageQuery) => void;
  isSearching: boolean;
  query: PageQuery;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="font-bold align-middle text-center">{title}</div>
      <SearchQuery
        initialText={query.query || undefined}
        placeholder={placeholder}
        onSearch={onSearch}
        isSearching={!!query?.query && isSearching}
      ></SearchQuery>
    </Card>
  );
}
