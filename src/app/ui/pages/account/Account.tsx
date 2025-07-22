import React from "react";
import {
    Star,
    CheckCircle,
    Truck,
    Package,
    RefreshCcw,
    MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const mockUser = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    orders: {
        paid: 5,
        sealed: 3,
        dispatched: 2,
        arrived: 2,
        confirmed: 1,
        returned: 0,
        reviewed: 4,
    },
    reviews: [
        {
            id: 1,
            item: "Wireless Headphones",
            rating: 4,
            comment: "Great sound quality!",
        },
        {
            id: 2,
            item: "Bluetooth Speaker",
            rating: 5,
            comment: "Excellent bass and clarity.",
        },
    ],
    sales: [
        {
            id: 1,
            item: "Used iPhone 12",
            status: "Sold",
        },
        {
            id: 2,
            item: "Gaming Laptop",
            status: "Sold",
        },
    ],
};

interface OrderStatusProps {
    label: string;
    count: number;
    Icon: React.ElementType;
}

export default function MyAccountPage() {

    const user = useSelector((state: RootState) => state.user)
    return (
        <div
            style={{
                maxWidth: "960px",
                margin: "0 auto",
                padding: "24px",
            }}
        >
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
                My Account
            </h1>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                    }}
                >
                    <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Profile Information</h2>
                    <button
                        style={{
                            padding: "6px 12px",
                            fontSize: "14px",
                            backgroundColor: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Edit Profile
                    </button>
                </div>
                <p>
                    {user.firstName} {user.lastName}
                </p>
                <p>
                    {user.email}
                </p>
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    marginBottom: "24px",
                }}
            >
                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                    Orders Overview
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "16px",
                    }}
                >
                    <OrderStatus label="Paid" count={mockUser.orders.paid} Icon={CheckCircle} />
                    <OrderStatus label="Sealed" count={mockUser.orders.sealed} Icon={Package} />
                    <OrderStatus label="Dispatched" count={mockUser.orders.dispatched} Icon={Truck} />
                    <OrderStatus label="Arrived" count={mockUser.orders.arrived} Icon={CheckCircle} />
                    <OrderStatus label="Confirmed" count={mockUser.orders.confirmed} Icon={CheckCircle} />
                    <OrderStatus label="Returned" count={mockUser.orders.returned} Icon={RefreshCcw} />
                    <OrderStatus label="Reviewed" count={mockUser.orders.reviewed} Icon={MessageSquare} />
                </div>
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    marginBottom: "24px",
                }}
            >
                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                    My Reviews
                </h2>
                {mockUser.reviews.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {mockUser.reviews.map((review) => (
                            <div
                                key={review.id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                }}
                            >
                                <h3 style={{ fontWeight: "500" }}>{review.item}</h3>
                                <p style={{ display: "flex", alignItems: "center" }}>
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            style={{ width: "16px", height: "16px", color: "#facc15" }}
                                            fill="currentColor"
                                        />
                                    ))}
                                </p>
                                <p style={{ color: "#555", fontStyle: "italic" }}>
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                    My Sales
                </h2>
                {mockUser.sales.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {mockUser.sales.map((sale) => (
                            <div
                                key={sale.id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>{sale.item}</span>
                                <span style={{ color: "green", fontWeight: "500" }}>{sale.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No items sold yet.</p>
                )}
            </div>
        </div>
    );
}

function OrderStatus({ label, count, Icon }: OrderStatusProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #ddd",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
        >
            <Icon style={{ width: "20px", height: "20px", color: "#2563eb" }} />
            <div>
                <p style={{ fontWeight: "600", margin: 0 }}>{label}</p>
                <p style={{ color: "#777", fontSize: "14px", margin: 0 }}>{count}</p>
            </div>
        </div>
    );
}
