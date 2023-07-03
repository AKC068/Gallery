import React, { useState, useEffect, useRef } from "react";
import { AutoComplete, Button, Divider } from "antd";

const SearchBar = ({ getSearch, callBackAPI }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [options, setOptions] = useState([]);
  let searchTimeout = useRef(null);
  let saveTimeout = useRef(null);

  useEffect(() => {
    // get stored queries from the browser local storage
    const storedQueries = localStorage.getItem("searchQueries");
    if (storedQueries) {
      setSuggestions(JSON.parse(storedQueries));
    }
  }, []);

  const handleInputChange = (value) => {
    // triggers when there is change in input field
    if (value !== query) {
      // check whether the input value remains the same
      setQuery(value);
      clearTimeout(searchTimeout.current);
      if (value === "") {
        callBackAPI(1);
      } else {
        searchTimeout.current = setTimeout(() => {
          getSearch(value, 1);
        }, 800);
      }
    }
  };

  const handleStoreSuggestion = () => {
    if (query !== "") {
      const updatedSuggestions = [
        query,
        ...suggestions.filter((suggestion) => suggestion !== query),
      ];
      setSuggestions(updatedSuggestions);
      localStorage.setItem("searchQueries", JSON.stringify(updatedSuggestions));
    }
  };

  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      handleStoreSuggestion();
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    setOptions(suggestions.map((suggestion) => ({ value: suggestion })));
  }, [suggestions]);

  const handleClearSuggestions = () => {
    setSuggestions([]);
    localStorage.removeItem("searchQueries");
  };

  const dropdownRender = (menu) => (
    <div>
      {menu}
      <Divider style={{ margin: "4px 0" }} />
      <div style={{ padding: "8px" }}>
        <Button onClick={handleClearSuggestions}>Clear Search History</Button>
      </div>
    </div>
  );

  return (
    <div className="search-bar">
      <AutoComplete
        placeholder="Search photos..."
        options={options}
        value={query}
        defaultActiveFirstOption={false}
        onChange={handleInputChange}
        allowClear={true}
        dropdownRender={dropdownRender}
        className="custom-autocomplete"
      />
    </div>
  );
};

export default SearchBar;
