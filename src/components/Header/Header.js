import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import { useMetStore } from "Store";

import "./Header.css";

const Header = () => {
  const setKeyword = useMetStore((state) => state.setKeyword);
  const fetchResult = useMetStore((state) => state.fetchResult);

  const handleScroll = () => {
    if (window.pageYOffset < 10) setScrolled(false);
    else if (window.pageYOffset > 150) setScrolled(true);
  };

  const [timeoutToken, setTimeoutToken] = useState(null); //todo useRef
  const [scrolled, setScrolled] = useState(false);

  const keyword = useMetStore((state) => state.keyword);
  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = (keyword) => {
    clearTimeout(timeoutToken);
    var token = setTimeout(() => setKeyword(keyword), 400);
    setTimeoutToken(token);
  };

  const total = useMetStore((state) => state.total);
  const titleAnimateProps = useSpring({
    from: { width: "0vw" },
    width: "100vw",
    // config: { duration: 800 },
    marginTop: scrolled ? "-2em" : "0.67em",
  });

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (keyword) fetchResult();

    return function cleanup() {
      // abortController.abort();
    };
  }, [fetchResult, keyword]);

  return (
    <animated.div className="header">
      <animated.h1 style={titleAnimateProps}>
        🏛 Metropolitan Museum of Art
      </animated.h1>
      <input
        type="search"
        placeholder="Enter keyword here..."
        onChange={(e) => setKeywordDebounced(e.target.value)}
        aria-label="search term"
        // value={keyword}
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
