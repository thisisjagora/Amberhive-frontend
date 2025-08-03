import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const LoadingAccount = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          navigate("/sign-in");
          // toast.success("OTP confirmed successfully!", {
          //   position: "top-right", // Toast position at the top-center
          // });
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex items-center justify-center">
        <svg
          width={radius * 2 + strokeWidth}
          height={radius * 2 + strokeWidth}
          viewBox={`0 0 ${radius * 2 + strokeWidth} ${
            radius * 2 + strokeWidth
          }`}
        >
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke="#facc15" // Yellow progress color
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.1s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>

        <div className="absolute flex items-center justify-center w-full h-full">
          <p className="text-2xl font-semibold">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingAccount;
