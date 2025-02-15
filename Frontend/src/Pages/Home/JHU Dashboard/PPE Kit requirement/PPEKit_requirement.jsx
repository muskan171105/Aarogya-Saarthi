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
      axios.get("http://localhost:3001/fetch_ppe")
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

      axios.get("http://localhost:3001/predict_ppe")
          .then(response => {
              console.log("predicted data", response.data);
              setPredictedData(response.data);
          })
          .catch(error => {
              console.error("Error fetching predicted data:", error);
          });
  }, []);

  // const chartData = PEEData.map(item => ({
  //     month: "October", bed_count: item.PPE_Kits_Available_in_October
  // })).concat(PEEData.map(item => ({
  //     month: "November", bed_count: item.PPE_Kits_Available_in_November
  // }))).concat(PEEData.map(item => ({
  //     month: "December", bed_count: item.PPE_Kits_Available_in_December
  // }))).concat(PEEData.map(item => ({
  //     month: "January", bed_count: item.PPE_Kits_Available_in_January
  // }))).concat(PEEData.map(item => ({
  //     month: "February", bed_count: item.PPE_Kits_Available_in_February
  // }))).concat(
  //     ["March", "April", "May"].map(month => ({
  //         month,
  //         bed_count: 0,
  //         predicted_bed_count: predictedData[month] || 0
  //     }))
  // );

  const chartData = PEEData.map(item => ({
    month: item.month,
    available_kits: item.PPE_Kits_Available || 0
  }));

  console.log("Chart Data:", chartData);
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
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="available_kits" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>

              {/* Actual Bed Count Table */}
              <h2 className="text-xl font-semibold mt-6">Current Bed Count (October - February)</h2>
              <table className="w-full mt-4 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Month</th>
                    <th className="p-2 border">Actual Bed Count</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(0, 5).map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 border">{item.month}</td>
                      <td className="p-2 border">{item.bed_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Predicted Bed Count Table */}
              <h2 className="text-xl font-semibold mt-6">Predicted Bed Requirement (March - May)</h2>
              <table className="w-full mt-4 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Month</th>
                    <th className="p-2 border">Predicted Bed Count</th>
                  </tr>
                </thead>
                <tbody>
                  {["March", "April", "May"].map((month, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 border">{month}</td>
                      <td className="p-2 border">{predictedData[month] || "Loading..."}</td>
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
