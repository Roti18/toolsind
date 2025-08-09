"use client";

import React, { useState, useEffect } from "react";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md transition-opacity duration-500 ${
        isVisible ? "bg-black/40" : "bg-black/0"
      }`}
    >
      <div
        className={`mx-auto w-full max-w-sm rounded-xl bg-zinc-900 p-8 shadow-2xl transition-all duration-500 ease-in-out transform relative overflow-hidden group hover:shadow-xl ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        <div className="text-center">{children}</div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
            className="w-full cursor-pointer rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
