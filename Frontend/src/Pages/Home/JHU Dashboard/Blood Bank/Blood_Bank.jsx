import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "../../style.css";
import SideBar from "../../SideBar";

function BloodBank() {
    const [bloodData, setBloodData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/blood_data")
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
                                        <th className="p-2 border">October</th>
                                        <th className="p-2 border">November</th>
                                        <th className="p-2 border">December</th>
                                        <th className="p-2 border">January</th>
                                        <th className="p-2 border">February</th>
                                        <th className="p-2 border">15 Days Requirement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bloodData.map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-2 border">{item["Blood Type"]}</td>
                                            <td className="p-2 border">{item.Data.October}</td>
                                            <td className="p-2 border">{item.Data.November}</td>
                                            <td className="p-2 border">{item.Data.December}</td>
                                            <td className="p-2 border">{item.Data.January}</td>
                                            <td className="p-2 border">{item.Data.February}</td>
                                            <td className="p-2 border">{item["15 Days Requirement"]}</td>
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

export default BloodBank;
