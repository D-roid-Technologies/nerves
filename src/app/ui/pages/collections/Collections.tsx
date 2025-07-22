import React from "react";
import "./Collections.css";

type Collection = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
};

const collections: Collection[] = [
    {
        id: 1,
        title: "Summer Essentials",
        description: "Breezy styles and must-haves for the sunny season.",
        imageUrl:
            "https://images.unsplash.com/photo-1520975698519-59c1a07d9a1d?auto=format&fit=crop&w=1350&q=80",
    },
    {
        id: 2,
        title: "Modern Classics",
        description: "Timeless pieces for a clean, versatile wardrobe.",
        imageUrl:
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1350&q=80",
    },
    {
        id: 3,
        title: "Sustainable Line",
        description: "Eco-friendly products crafted with care.",
        imageUrl:
            "https://images.unsplash.com/photo-1595433562696-9f3e819fdf99?auto=format&fit=crop&w=1350&q=80",
    },
];

const Collections: React.FC = () => {
    return (
        <div className="collections-page">
            <div className="collections-hero">
                <h1>Our Collections</h1>
                <p>Explore curated collections crafted for every lifestyle.</p>
            </div>

            <div className="collections-grid">
                {collections.map((collection) => (
                    <div key={collection.id} className="collection-card">
                        <div
                            className="collection-image"
                            style={{ backgroundImage: `url(${collection.imageUrl})` }}
                        ></div>
                        <div className="collection-content">
                            <h2>{collection.title}</h2>
                            <p>{collection.description}</p>
                            <button className="collection-button">Shop Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collections;