import { Models } from 'appwrite'; // Import Models from Appwrite SDK
import React from 'react' // Import React for component creation
import Loader from './Loader'; // Import Loader component for loading indication
import GridPostList from './GridPostList'; // Import GridPostList component for displaying posts in a grid

// Interface for SearchResultProps defining expected properties
type SearchResultProps = {
    isSearchFetching: boolean; // Flag indicating if search is fetching data
    searchedPosts: Models.Document[]; // Array of Appwrite document models containing search results
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {

    // Conditionally render Loader component if search is fetching data
    if (isSearchFetching) return <Loader />

    // Check if searchedPosts exist and have documents before rendering GridPostList
    if (searchedPosts && searchedPosts.documents.length > 0) {
        return (
            <GridPostList posts = {searchedPosts.documents}/> // Pass documents array to GridPostList
        )
    }

    // Render message if no search results are found
    return (
        <p className = 'text-light-4 mt-10 text-center w-full'>
            No results found.
        </p>
    )
}

export default SearchResults; // Export SearchResults component
