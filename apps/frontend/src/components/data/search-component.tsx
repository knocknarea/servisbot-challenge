import { PageQuery } from '@servisbot/model';
import { Spinner, TextInput } from 'flowbite-react';
import { debounce } from 'lodash';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { BotStoreInitialState } from '../../store/bot-store';

/**
 * A component that presents a text input
 * debounces the values (by 500ms), then
 * calls the suppled onSearch callback
 *
 * @export
 * @param {{ onSearch: (query: PageQuery) => void}} {onSearch search callback that receives a new PageQuery with search text}
 * @return {*}
 */
export default function SearchQuery({
  placeholder,
  onSearch,
  isSearching,
  initialText,
  className,
}: {
  placeholder: string;
  onSearch: (query: PageQuery) => void;
  isSearching: boolean;
  initialText?: string;
  className?: string;
}) {
  // Separate the initial value from any state
  // that might change it. This control is taking
  // over the means of change the query search value.
  const [text] = useState(initialText || '');

  const handleChange = useMemo(
    () =>
      debounce((e: ChangeEvent<HTMLInputElement>) => {
        onSearch({
          pageNumber: 0,
          pageSize: BotStoreInitialState.botListQuery.pageSize,
          query: (e.target.value || '').trim(),
        });
      }, 500),
    [onSearch],
  );

  //
  // Ensure to cancel any pending debouncing events
  // before dismount or after render cycle.
  //
  useEffect(() => {
    return handleChange.cancel();
  }, [handleChange]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
        {isSearching ? (
          <Spinner size="sm"></Spinner>
        ) : (
          <FaMagnifyingGlass></FaMagnifyingGlass>
        )}
      </div>
      <TextInput
        className="block w-full p-3 ps-9 "
        type="text"
        placeholder={placeholder}
        defaultValue={text}
        onChange={handleChange}
      ></TextInput>
    </div>
  );
}
