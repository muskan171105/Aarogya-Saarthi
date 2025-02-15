import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "../../style.css";
import SideBar from "../../SideBar";

function BloodBank() {
    const [bloodData, setBloodData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3001/blood_data")
            .then(response => {
                setBloodData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching blood data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="Home">
            <SideBar />
            <section className="home-section p-6">
                <div className="home-content">
                    <h1 className="text-2xl font-bold mb-4">Blood Availability</h1>
                    {loading ? (
                        <p>Loading data...</p>
                    ) : (
                        <>
                            {/* Bar Chart for Blood Stock */}
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={bloodData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Blood Type" />
                                    <YAxis />
                                    <Bar dataKey="15 Days Requirement" fill="#e74c3c" />
                                </BarChart>
                            </ResponsiveContainer>

                            {/* Blood Stock Table */}
                            <h2 className="text-xl font-semibold mt-6">Blood Stock Data</h2>
                            <table className="w-full mt-4 border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Blood Type</th>
                                        <th className="p-2 border">October (in Litres)</th>
                                        <th className="p-2 border">November (in Litres)</th>
                                        <th className="p-2 border">December (in Litres)</th>
                                        <th className="p-2 border">January (in Litres)</th>
                                        <th className="p-2 border">February (in Litres)</th>
                                        <th className="p-2 border">15 Days Requirement (in Litres)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bloodData.length > 0 ? (
                                        bloodData.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2 border">{item["Blood Type"] || "N/A"}</td>
                                                <td className="p-2 border">{(item.Data?.October ?? 0).toFixed(2)}</td>
                                                <td className="p-2 border">{(item.Data?.November ?? 0).toFixed(2)}</td>
                                                <td className="p-2 border">{(item.Data?.December ?? 0).toFixed(2)}</td>
                                                <td className="p-2 border">{(item.Data?.January ?? 0).toFixed(2)}</td>
                                                <td className="p-2 border">{(item.Data?.February ?? 0).toFixed(2)}</td>
                                                <td className="p-2 border">{(item["15 Days Requirement"] ?? 0).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default BloodBank;
