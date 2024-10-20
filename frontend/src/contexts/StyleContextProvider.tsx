import * as React from "react";

// This context provider deals with global variables for styling
// and global events for styling

type Theme = "Light" | "Dark";

interface StyleContextProps {
  currentTheme: Theme;
  setCurrentTheme: (value: Theme) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  windowWidth: number;
}

// create the context
const StyleContext = React.createContext<StyleContextProps>({
  currentTheme: "Dark",
  setCurrentTheme: () => {},
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  windowWidth: window.innerWidth,
});

// create the provider component
export function StyleContextProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>("Light");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [windowWidth, setWindowWidth] = React.useState<number>(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StyleContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        isDrawerOpen,
        setIsDrawerOpen,
        windowWidth,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
}

const useStateStyleContext = () => React.useContext(StyleContext);

export default useStateStyleContext;
