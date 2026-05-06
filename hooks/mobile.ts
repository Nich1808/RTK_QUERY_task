import * as React from "react";

const BREAKPOINT = 768;

export const useIsMobile = () => {
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);

    const updateValue = () => {
      setMobile(window.innerWidth < BREAKPOINT);
    };

    updateValue(); 

    mediaQuery.addEventListener("change", updateValue);

    return () => {
      mediaQuery.removeEventListener("change", updateValue);
    };
  }, []);

  return mobile;
};