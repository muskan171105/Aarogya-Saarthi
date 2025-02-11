import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../../style.css";
import SideBar from "../../SideBar";

function Beds_requirement() {
    const [bedData, setBedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3001/fetch-data")
            .then(response => {
                setBedData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

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
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={bedData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="bed_count" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="predicted_bed_count" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                            <h2 className="text-xl font-semibold mt-6">Detailed Bed Requirement Data</h2>
                            <div className="w-full mt-4 border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2">Month</th>
                                        <th className="p-2">Actual Bed Count</th>
                                        <th className="p-2">Predicted Bed Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bedData.map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-2">{item.month}</td>
                                            <td className="p-2">{item.bed_count}</td>
                                            <td className="p-2">{item.predicted_bed_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Beds_requirement;