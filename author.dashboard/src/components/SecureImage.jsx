import React, { useEffect, useState } from "react";

const SecureImage = ({ imagePath, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !imagePath) return;

    const fetchImage = async () => {
      try {
        const response = await fetch(`https://d32d-105-112-236-80.ngrok-free.app/storage/${imagePath}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Image fetch failed");
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl); // Cleanup
      } catch (error) {
        console.error("Image load error:", error);
      }
    };

    fetchImage();
  }, [imagePath]);

  if (!imageUrl) return <div className="w-10 h-14 bg-gray-200 rounded animate-pulse" />;

  return <img src={imageUrl} alt={alt} className={className} />;
};

export default SecureImage;
