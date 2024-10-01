import React, { useEffect, useState, useRef, memo } from "react";
import { useSpring, animated } from "@react-spring/web";

import { useArtStore } from "@store/useArtStore";

import "./Header.css";

const Header = () => {
  const keyword = useArtStore((state) => state.keyword);
  const total = useArtStore((state) => state.total);
  const setKeyword = useArtStore((state) => state.setKeyword);

  const handleScroll = () => {
    if (window.scrollY < 10) setScrolled(false);
    else if (window.scrollY > 150) setScrolled(true);
  };

  const inputRef = useRef();
  const timeoutToken = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  // const { searchArtworks } = useArtSearch();
  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = (keyword) => {
    clearTimeout(timeoutToken.current); // clear the existing timeout so that the previous setKeyword call won't not go through (if less than 400 ms has passed)
    timeoutToken.current = setTimeout(() => setKeyword(keyword), 50);
  };

  const squeezeExpandProps = useSpring({
    marginTop: scrolled ? "-2em" : "0.67em",
  });

  const rollOpenProps = useSpring({
    from: { width: "0vw" },
    width: "100vw",
    config: { duration: 1000 },
  });

  useEffect(() => {
    inputRef.current.focus();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutToken.current);
      timeoutToken.current = null;
    };
  }, []);

  return (
    <animated.div className="header">
      <animated.div style={rollOpenProps}>
        <animated.h1 style={squeezeExpandProps}>
          🏛 Metropolitan Museum of Art
        </animated.h1>
      </animated.div>
      <input
        type="search"
        placeholder="Enter keyword here..."
        onChange={(e) => setKeywordDebounced(e.target.value)}
        aria-label="search term"
        data-testid="searchInput"
        ref={inputRef}
        value={keyword}
      />
      <ResultsCaption total={total} keyword={keyword} />
    </animated.div>
  );
};

const ResultsCaption = ({ total, keyword, ...props }) =>
  keyword ? (
    <animated.span className="search-caption" {...props}>
      {total + ` results for: ` + keyword}
    </animated.span>
  ) : null;

export default memo(Header);
