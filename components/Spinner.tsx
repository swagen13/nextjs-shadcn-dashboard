import React from "react";

interface SpinnerProps {
  size?: number; // Size in pixels
}

export default function Spinner({ size = 48 }: SpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200"
        style={{
          height: size,
          width: size,
          borderWidth: size / 12,
          borderTopColor: "#3498db",
        }}
      ></div>
      <style jsx>{`
        .loader {
          -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
        }
        @-webkit-keyframes spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
