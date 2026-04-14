import React, { useState, useEffect } from "react";
import "./ImageGallery.css";
import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

function ImageGallery() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ACCESS_KEY = "BfdPepqgZW1ukRGUZmQfSMtqK5D5c5FzxxzDMvnBFRs";

  // 🔥 Download function
  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "image.jpg";
      link.click();
    } catch (error) {
      console.log("Download failed", error);
    }
  };

  // 🔥 Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);

        let url = "";

        if (search.trim() === "") {
          url = `https://api.unsplash.com/photos?client_id=${ACCESS_KEY}`;
        } else {
          url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${ACCESS_KEY}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        setImages(search.trim() === "" ? data : data.results || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setImages([]);
        setLoading(false);
      }
    };

    fetchImages();
  }, [search]);

  return (
    <div className="app">

      {/* 🔥 NAVBAR ADDED HERE */}
      <Navbar />

      <h1 className="title">Image Gallery</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="no-results">No images found!</div>
      )}

      <div className="gallery">
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="image-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={img.urls.small} alt={img.alt_description} />

            <button
              className="download-btn"
              onClick={() => downloadImage(img.urls.full)}
            >
              <FiDownload />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;