import { useState, useEffect } from "react";
import SideBar from "../../SideBar";
import "../../style.css";
// import { Bar } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Diagnostic_Equipments() {
  const [equipmentData, setEquipmentData] = useState([]); // Stores current stock
  const [predictedData, setPredictedData] = useState({}); // Stores predicted stock
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    fetchStockData();
  }, []);

  // Function to fetch all stock data
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current stock from Node.js API
      const stockResponse = await fetch("http://localhost:3001/get_all_stock", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const stockData = await stockResponse.json();
      if (!stockResponse.ok) throw new Error(stockData.error || "Failed to fetch stock data");

      // Fetch predicted stock from Node.js API
      const predictionResponse = await fetch("http://localhost:3001/predict_future_stock", {
        method: "GET", // CHANGED FROM POST TO GET
        headers: { "Content-Type": "application/json" },
      });

      const predictionData = await predictionResponse.json();
      if (!predictionResponse.ok) throw new Error(predictionData.error || "Failed to fetch predictions");

      setEquipmentData(stockData.equipments); // Expecting array of { diagnostic_equipments, stock_available }
      setPredictedData(predictionData.predicted_stock || {}); // Expecting { equipment_name: [v1, v2, v3] }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  console.log("equipmentData:", equipmentData);
  console.log("predictedData:", predictedData);

  const chartData = {
    labels: equipmentData.map((item) => item.Equipment_Type  ), // X-axis labels
    datasets: [
      {
        label: "Current Stock",
        data: equipmentData.map((item) => item.stock_available),
        backgroundColor: "#3498db",
      },
      {
        label: "March",
        data: equipmentData.map((item) => predictedData[item.diagnostic_equipments]?.[0] || 0),
        backgroundColor: "#ff9800",
      },
      {
        label: "April",
        data: equipmentData.map((item) => predictedData[item.diagnostic_equipments]?.[1] || 0),
        backgroundColor: "#4caf50",
      },
      {
        label: "May",
        data: equipmentData.map((item) => predictedData[item.diagnostic_equipments]?.[2] || 0),
        backgroundColor: "#e74c3c",
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Diagnostic Equipment Stock Analysis",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Equipment Name",
        },
      },
      y: {
        title: {
          display: true,
          text: "Stock Count",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="home">
      <SideBar />

      <section className="home-section">
        <div className="home-content">
          <h2>Diagnostic Equipment Stock Analysis</h2>

          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : (
            <>
              {/* Bar Chart */}
              <div style={{ width: "80%", margin: "0 auto" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>

              {/* Data Table */}
              <h2>Stock Details</h2>
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Current Stock</th>
                    <th>March</th>
                    <th>April</th>
                    <th>May</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.diagnostic_equipments}</td>
                      <td>{item.stock_available}</td>
                      <td>{predictedData[item.diagnostic_equipments]?.[0] || "N/A"}</td>
                      <td>{predictedData[item.diagnostic_equipments]?.[1] || "N/A"}</td>
                      <td>{predictedData[item.diagnostic_equipments]?.[2] || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Diagnostic_Equipments;
