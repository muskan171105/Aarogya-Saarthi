import { useState, useEffect } from "react";
import SideBar from "../../SideBar";
import "../../style.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Diagnostic_Equipments() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch stock data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/get_stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipment: "MRI" }) // Change equipment name dynamically
      });

      const stockData = await response.json();
      if (!response.ok) throw new Error(stockData.error);

      // Fetch predicted stock
      const predictionResponse = await fetch("http://localhost:3000/predict_future_stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const predictionData = await predictionResponse.json();
      if (!predictionResponse.ok) throw new Error(predictionData.error);

      setEquipmentData([
        { name: "Current Stock", value: stockData.stock_available },
        { name: "Predicted (1 Month)", value: predictionData.predicted_stock[0] },
        { name: "Predicted (2 Months)", value: predictionData.predicted_stock[1] },
        { name: "Predicted (3 Months)", value: predictionData.predicted_stock[2] },
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Chart Data
  const chartData = {
    labels: equipmentData.map((item) => item.name),
    datasets: [
      {
        label: "Stock Levels",
        data: equipmentData.map((item) => item.value),
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#f44336"],
      },
    ],
  };

  return (
    <div className="home">
      <SideBar />

      <section className="home-section">
        <div className="home-content">
          <h2>Diagnostic Equipment Stock Analysis</h2>

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* Bar Chart */}
              <div className="chart-container">
                <Bar data={chartData} />
              </div>

              {/* Data Table */}
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Stock Type</th>
                    <th>Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.value}</td>
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
