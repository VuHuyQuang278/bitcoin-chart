import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { GetCandles, GetCryptoInfo } from "../utils/api";

const BitcoinCandleChart = () => {
  const chartContainerRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState('1m');

  const timeFrame = ['1m', '5m', '30m', '1h', '4h', '12h', '1d', '3d', '1w', '1M'];

  useEffect(() => {
    // Kiểm tra biểu đồ đã có trong DOM hay chưa
    if (!chartContainerRef.current) return;
  
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
      },
      priceScale: {
        borderColor: "rgba(197, 203, 206, 1)",
        autoScale: true,      
      },
      timeScale: {
        borderColor: "rgba(197, 203, 206, 1)",
      },
    });

    const candleSeries = chart.addCandlestickSeries();

    const volumeSeries = chart.addHistogramSeries({
      color: "rgba(0, 150, 136, 0.5)",
      priceFormat: { type: "volume" },
      priceScaleId: "volume", // Gán ID cho volume scales
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.7, bottom: 0 }, // Volume chiếm 30% phía dưới
    });


    const fetchData = async () => {
      const data = await GetCandles(`${selectedValue}`, 'BTCUSDT');
      const formattedData = data.map(({openTime, open, high, low, close}) => ({
        time: openTime / 1000,
        open,
        high,
        low,
        close,
      }));
      candleSeries.setData(formattedData);

      const volumeData = data.map(({openTime, open, close, volume}) => ({
        time: openTime / 1000,
        value: parseFloat(volume),
        color: close > open ? "rgba(0, 150, 136, 0.5)" : "rgba(255, 82, 82, 0.5)",
      }));
      volumeSeries.setData(volumeData);
    };
    fetchData();

    // Theo dõi kích thước màn hình và cập nhật lại chart
    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      chart.timeScale().fitContent();
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [selectedValue]);

  const handleClick = (value) => {
    setSelectedValue(value);
  };

  const handleGetBitcoinValue = async () => {
    const data = await GetCryptoInfo('BTCUSDT');
    window.confirm(`
      Giá trị của Bitcoin hiện tại là: ${parseFloat(data.data.lastPrice).toFixed(2)} USTD
      Giá trị của Bitcoin trước 1 phút là: ${(data.data.lastPrice - data.data.priceChange).toFixed(2)} USTD
    `);
  }

  return  (
    <>
      <div ref={chartContainerRef} className="w-4/5  mx-auto" />  
      <div className="w-4/5 mx-auto flex flex-wrap justify-start items-center gap-2 my-4">
        {timeFrame.map((time) => (
          <button 
            key={time} 
            type="button" 
            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-500 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:text-blue-700"
            onClick={() => handleClick(time)}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="w-4/5 mx-auto">
        <button 
          type="button" 
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-500 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:text-blue-700"
          onClick={handleGetBitcoinValue}
        >
          Lấy giá trị Bitcoin
        </button>  
      </div>  
    </>
  )
};

export default BitcoinCandleChart;
