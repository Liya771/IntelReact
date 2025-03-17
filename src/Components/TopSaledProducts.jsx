import { useEffect, useState } from "react";
import "./TopSaledProducts.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TopSaledProducts = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/top-saled-products`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch data! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched Data:", data);
                setTopProducts(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    return (
        <div className="top-products-container">
            <h2 className="title"> Top 10 Best-Selling Products</h2>

            {loading ? (
                <div className="loading-spinner"></div> // 🔄 Loading animation
            ) : error ? (
                <p className="error-message">⚠️ {error}</p> // 📌 Improved error message
            ) : topProducts.length === 0 ? (
                <p className="no-data">📭 No products available.</p>
            ) : (
                <div className="table-container"> {/* Makes table responsive */}
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Total Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                                    <td>{index + 1}</td>
                                    <td>{product.product_name}</td>
                                    <td>{product.total_quantity_sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TopSaledProducts;
