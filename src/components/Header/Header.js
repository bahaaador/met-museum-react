import React, { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "react-spring";

import { useMetStore } from "Store";

import "./Header.css";

const Header = () => {
  const keyword = useMetStore((state) => state.keyword);
  const total = useMetStore((state) => state.total);

  const setKeyword = useMetStore((state) => state.setKeyword);
  const fetchResult = useMetStore((state) => state.fetchResult);

  const handleScroll = () => {
    if (window.pageYOffset < 10) setScrolled(false);
    else if (window.pageYOffset > 150) setScrolled(true);
  };

  const timeoutToken = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = (keyword) => {
    clearTimeout(timeoutToken.current); // clear the existing timeout so that the previous setKeyword call won't not go through (if less than 400 ms has passed)
    timeoutToken.current = setTimeout(() => setKeyword(keyword), 400);
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
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (keyword) fetchResult();
  }, [fetchResult, keyword]);

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

export default Header;
