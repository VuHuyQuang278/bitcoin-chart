import { useEffect, useState } from "react";
import DarkModeBtn from "./components/DarkModeBtn";
import BitcoinCandleChart from "./components/ChartComponent";
import { ThemeProvider } from "./contexts/theme";
import { getCryptoImage } from "./utils/api";


function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = localStorage.getItem("darkMode");
    return isDark === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());

    const bodyEl = document.body;
    if (bodyEl) {
      if (darkMode) {
        bodyEl.classList.add("dark");
      } else {
        bodyEl.classList.remove("dark");
      }
    }
  }, [darkMode]);

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <div className="h-screen dark:bg-gray-900">
        <div className="pt-4 ml-4">
          <DarkModeBtn />
        </div>
        <div className="flex justify-around items-center my-4 w-1/3 mx-auto gap-2">
          <h1 className="text-sm md:text-2xl lg:text-4xl font-bold block dark:text-white ">Biểu đồ dữ liệu bitcoin</h1>
          <img src={`${getCryptoImage('BTCUSDT')}`} alt="bitcoin image" className="lg:w-10 lg:h-10 h-5 w-5" />
        </div>
        <div className="container">
          <BitcoinCandleChart />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;