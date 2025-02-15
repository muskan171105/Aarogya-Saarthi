import { useState, useEffect } from "react";
import SideBar from "../../SideBar";
import "../../style.css";
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
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3001/get_stock_with_prediction");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch stock data");

      setEquipmentData(data.equipments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  console.log("equipmentData:", equipmentData);

  const chartData = {
    labels: equipmentData.map((item) => item.Equipment_Type),
    datasets: [
      {
        label: "Current Stock",
        data: equipmentData.map((item) => item.Stock_Availability),
        backgroundColor: "#3498db",
      },
      {
        label: "Predicted Stock (Month 1)",
        data: equipmentData.map((item) => item.Predicted_Availability?.[0] || 0),
        backgroundColor: "#ff9800",
      },
      {
        label: "Predicted Stock (Month 2)",
        data: equipmentData.map((item) => item.Predicted_Availability?.[1] || 0),
        backgroundColor: "#4caf50",
      },
      {
        label: "Predicted Stock (Month 3)",
        data: equipmentData.map((item) => item.Predicted_Availability?.[2] || 0),
        backgroundColor: "#e74c3c",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Diagnostic Equipment Stock Analysis" },
    },
    scales: {
      x: { title: { display: true, text: "Equipment Name" } },
      y: { title: { display: true, text: "Stock Count" }, beginAtZero: true },
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
              <div style={{ width: "80%", margin: "0 auto" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>

              <h2>Stock Details</h2>
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Current Stock</th>
                    <th>Predicted Stock (Month 1)</th>
                    <th>Predicted Stock (Month 2)</th>
                    <th>Predicted Stock (Month 3)</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Equipment_Type}</td>
                      <td>{item.Stock_Availability}</td>
                      <td>{item.Predicted_Availability?.[0] || "N/A"}</td>
                      <td>{item.Predicted_Availability?.[1] || "N/A"}</td>
                      <td>{item.Predicted_Availability?.[2] || "N/A"}</td>
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
