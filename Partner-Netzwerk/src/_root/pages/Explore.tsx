import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults: React.FC<SearchResultProps> = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">Keine Beiträge gefunden</p>
    );
  }
};

const Explore: React.FC = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPosts();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);

  useEffect(() => {
    if (inView && !searchValue && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, searchValue, isFetchingNextPage, hasNextPage]);

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prevRoles => 
      prevRoles.includes(role) ? prevRoles.filter(r => r !== role) : [...prevRoles, role]
    );
  };

  const filterPostsByRoles = (posts: any[]) => {
    if (selectedRoles.length === 0) {
      return posts;
    }
    return posts.filter(post => selectedRoles.some(role => post.creator.role.includes(role)));
  };

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = debouncedSearch !== "";
  const filteredSearchPosts = searchedPosts ? filterPostsByRoles(searchedPosts.documents) : [];
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Beiträge suchen</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" width={24} height={24} alt="search" />
          <Input
            type="text"
            placeholder="Suchen"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Beliebt</h3>
        <div className="flex-center gap-3 rounded-xl px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-left bg-dark-3 rounded-xl gap-2 px-4 py-2 flex justify-between items-center w-full">
              <span>{selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Nach Rolle sortieren'}</span>
              <img src="/assets/icons/filter.svg" width={20} height={20} alt="filter" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dark-1 border-4 border-dark-4 w-full">
              {["Ecurie-Aix", "Alumni", "Partner", "Hersteller"].map(role => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => handleRoleChange(role)}
                  className="hover:bg-ecurie-babyblue"
                >
                  {role}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults isSearchFetching={isSearchFetching} searchedPosts={{ documents: filteredSearchPosts }} />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">Ende der Beiträge</p>
        ) : (
          posts.pages.map((page, index) => (
            <GridPostList key={`page-${index}`} posts={filterPostsByRoles(page.documents)} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
