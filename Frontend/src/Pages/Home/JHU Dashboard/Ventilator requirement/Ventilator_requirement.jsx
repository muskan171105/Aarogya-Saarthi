import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts";
import "../../style.css";
import SideBar from "../../SideBar";

function Ventilator() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://jhu-techlions-ventilator-testing-node.onrender.com/predict-ventilator")
            .then(response => {
                const { input_data, predicted_data } = response.data;
                console.log("input_data", input_data);
                console.log("predicted_data", predicted_data);
                
                // Create a set of all unique months from both actual and predicted data
                const allMonths = new Set([...Object.keys(input_data), ...Object.keys(predicted_data)]);
                
                // Convert to an array with actual and predicted values
                const formattedData = Array.from(allMonths).map(month => ({
                    month,
                    Ventilator_count: input_data[month] || 0, // Use actual data if available, else 0
                    predicted_Ventilator_count: predicted_data[month] || 0 // Use predicted data if available, else 0
                }));

                console.log("Formatted Chart Data:", formattedData); // Debugging output
                setChartData(formattedData);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching ventilator data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="Home">
            <SideBar />
            <section className="home-section p-6">
                <div className="home-content">
                    <h1 className="text-2xl font-bold mb-4">Ventilator Requirements Over Time</h1>

                    {loading ? (
                        <p>Loading data...</p>
                    ) : (
                        <>
                            {/* Bar Chart for Ventilator Counts */}
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Bar dataKey="Ventilator_count" fill="#3498db" />  {/* Blue */}
                                    <Bar dataKey="predicted_Ventilator_count" fill="#e74c3c" />  {/* Red */}
                                </BarChart>
                            </ResponsiveContainer>

                            {/* Current Bed Count Table */}
                            <h2 className="text-xl font-semibold mt-6">Current Ventilator Count (October - February)</h2>
                            <table className="w-full mt-4 border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Month</th>
                                        <th className="p-2 border">Actual Ventilator Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.length > 0 ? (
                                        chartData.slice(0, 5).map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2 border">{`${item.month}`}</td>
                                                <td className="p-2 border">{item.Ventilator_count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="p-2 text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Predicted Bed Count Table */}
                            <h2 className="text-xl font-semibold mt-6">Predicted Ventilator Requirement (March - May)</h2>
                            <table className="w-full mt-4 border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Month</th>
                                        <th className="p-2 border">Predicted Ventilator Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.slice(5, 8).map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-2 border">{item.month}</td>
                                            <td className="p-2 border">{item.predicted_Ventilator_count || "Loading..."}</td>
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

export default Ventilator;
