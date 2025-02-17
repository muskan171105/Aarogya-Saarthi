import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "../../style.css";
import SideBar from "../../SideBar";

function PPE() {
  const [PEEData, setPEEData] = useState([]);
  const [predictedData, setPredictedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      console.log("hi");
      axios.get("http://localhost:3002/fetch_ppe")
          .then(response => {
            console.log("Raw API Response:", response.data);
        
              // Ensure response is an object with months as keys
              if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
                  const convertedData = Object.entries(response.data).map(([month, value]) => ({
                      month,  
                      PPE_Kits_Available: value 
                  }));

                  console.log("Converted Data for Chart:", convertedData);
                  setPEEData(convertedData);
              } else {
                  console.error("Unexpected API response format", response.data);
              }

              setLoading(false);
          })
          .catch(error => {
              console.error("Error fetching actual bed data:", error);
              setLoading(false);
          });

      axios.get("http://localhost:3002/predict_ppe")
          .then(response => {
              console.log("predicted data", response.data);
              setPredictedData(response.data);
          })
          .catch(error => {
              console.error("Error fetching predicted data:", error);
          });
  }, []);

  const monthMapping = {
    PPE_Kits_Available_in_october: "November",
    PPE_Kits_Available_in_November: "December",
    PPE_Kits_Available_in_December: "January",
    PPE_Kits_Available_in_January: "February",
    April: "May",
    March: "April",
    February: "March"
};

const combinedData = {};

  // Add Actual Data (PEEData)
  PEEData.forEach(item => {
      const monthName = monthMapping[item.month] || item.month;
      combinedData[monthName] = {
          month: monthName,
          available_kits: item.PPE_Kits_Available || 0,
          predicted_kits: 0 // Default 0 for predicted if not available
      };
  });

  // Add Predicted Data
  Object.entries(predictedData).forEach(([month, value]) => {
      const monthName = monthMapping[month] || month;
      if (!combinedData[monthName]) {
          combinedData[monthName] = {
              month: monthName,
              available_kits: 0, // Default 0 for actual if not available
              predicted_kits: value
          };
      } else {
          combinedData[monthName].predicted_kits = value;
      }
  });
  // Convert to Array for Recharts
  const chartData = Object.values(combinedData);

  const monthOrder = [
    "November", "December", "January", "February", 
    "March", "April", "May"
  ];
  
  // Sort chartData based on monthOrder
  const sortedChartData = chartData.sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  console.log("Sorted Chart Data:", sortedChartData);
  
  return (
    <div className="Home">
      <SideBar />

      <section className="home-section p-6">
        <div className="home-content">
          <h1 className="text-2xl font-bold mb-4">PPE Kit Requirements Over Time</h1>

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
               {/* Bar Chart */}
               <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sortedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="available_kits" fill="#3498db" name="Actual PPE Kits" />
                  <Bar dataKey="predicted_kits" fill="#e74c3c" name="Predicted PPE Kits" />
                </BarChart>
              </ResponsiveContainer>

              {/* Actual Bed Count Table */}
              <h2 className="text-xl font-semibold mt-6">Current PPE Kit Count (November - February)</h2>
              <table className="w-full mt-4 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Month</th>
                    <th className="p-2 border">Actual PPE Kit Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedChartData.slice(0, 4).map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 border">{item.month}</td>
                      <td className="p-2 border">{item.available_kits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Predicted Bed Count Table */}
              <h2 className="text-xl font-semibold mt-6">Predicted PPE Kit Requirement (March - May)</h2>
              <table className="w-full mt-4 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Month</th>
                    <th className="p-2 border">Predicted Bed Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedChartData.slice(4, 7).map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 border">{item.month}</td>
                      <td className="p-2 border">{item.predicted_kits || "Loading..."}</td>
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

export default PPE;
