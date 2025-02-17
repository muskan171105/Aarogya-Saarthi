import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "../../style.css";
import SideBar from "../../SideBar";

function Beds_requirement() {
    const [bedData, setBedData] = useState([]);
    const [predictedData, setPredictedData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch actual bed data (October - February)
        axios.get("https://jhu-techlions-bed-node.onrender.com/fetch-data")
            .then(response => {
                // Convert object response into an array of { month, bed_count } objects
                const formattedData = Object.entries(response.data).map(([month, bed_count]) => ({
                    month,
                    bed_count
                }));
                setBedData(formattedData);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching actual bed data:", error);
                setLoading(false);
            });

        // Fetch predicted bed data (March - May)
        axios.get("https://jhu-techlions-bed-node.onrender.com/predict-beds", { timeout: 120000 })
            .then(response => {
                setPredictedData(response.data);
            })
            .catch(error => {
                console.error("Error fetching predicted data:", error);
            });
    }, []);

    // Format data for the chart (combining actual and predicted data)
    const chartData = [
        ...bedData.map(item => ({
            month: item.month,
            bed_count: item.bed_count,
            predicted_bed_count: 0
        })),
        { month: "March", bed_count: 0, predicted_bed_count: predictedData.March || 0 },
        { month: "April", bed_count: 0, predicted_bed_count: predictedData.April || 0 },
        { month: "May", bed_count: 0, predicted_bed_count: predictedData.May || 0 }
    ];

    return (
        <div className="Home">
            <SideBar />
            <section className="home-section p-6">
                <div className="home-content">
                    <h1 className="text-2xl font-bold mb-4">Bed Requirements Over Time</h1>

                    {loading ? (
                        <p>Loading data...</p>
                    ) : (
                        <>
                            {/* Bar Chart for Bed Counts */}
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month"/>
                                    <YAxis />
                                    <Bar dataKey="bed_count" fill="#3498db" />  {/* Blue */}
                                    <Bar dataKey="predicted_bed_count" fill="#e74c3c" />  {/* Red */}
                                </BarChart>
                            </ResponsiveContainer>

                            {/* Current Bed Count Table */}
                            <h2 className="text-xl font-semibold mt-6">Current Bed Count (October - February)</h2>
                            <table className="w-full mt-4 border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Month</th>
                                        <th className="p-2 border">Actual Bed Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bedData.length > 0 ? (
                                        bedData.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2 border">{item.month}</td>
                                                <td className="p-2 border">{item.bed_count}</td>
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

export default Beds_requirement;
