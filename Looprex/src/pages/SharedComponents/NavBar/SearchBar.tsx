import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./style.navBar.css.module.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SearchBar = () => {

    const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${query}`);
      setQuery('');
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSearch}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Buscar producto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.searchButton}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};