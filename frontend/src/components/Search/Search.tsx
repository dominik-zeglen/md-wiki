import React from "react";
import ReactModal from "react-modal";
import { trpc } from "src/hooks/api/trpc";
import { Input } from "src/components/Input";
import { Link } from "react-router-dom";
import { siteRoutes } from "src/routes";
import debounce from "lodash/debounce";
import styles from "./Search.scss";
import { BaseDialogProps, dialogStyles } from "../Dialog";
import { Loader } from "../Loader";

export interface SearchProps extends BaseDialogProps {}

export const Search: React.FC<SearchProps> = ({ open, onClose }) => {
  const [query, setQuery] = React.useState("");
  const enabled = open && query.length > 0;
  const { data: searchResults, isLoading } = trpc.pages.search.useQuery(query, {
    enabled,
  });
  const onSearch = debounce((event) => setQuery(event.target.value), 300);

  return (
    <ReactModal
      isOpen={open}
      style={{
        ...dialogStyles,
        content: {
          ...dialogStyles.content,
          width: "400px",
        },
      }}
      onRequestClose={onClose}
    >
      <Input
        className={styles.input}
        autoFocus
        fullWidth
        placeholder="Search pages"
        onChange={onSearch}
      />
      {enabled && isLoading ? (
        <div className={styles.loader}>
          <Loader size="32px" />
        </div>
      ) : searchResults === undefined ? null : searchResults.length > 0 ? (
        searchResults.map((page) => (
          <div className={styles.result} key={page.slug}>
            <Link to={siteRoutes.page.to({ slug: page.slug })}>
              <h6>{page.title}</h6>
            </Link>
            <div className={styles.resultContent}>{page.brief}...</div>
          </div>
        ))
      ) : (
        "No pages found"
      )}
    </ReactModal>
  );
};
