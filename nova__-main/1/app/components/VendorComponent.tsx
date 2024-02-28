import React, { useState } from "react";
import VendorForm from "./VendorForm";
import VendorView from "./VendorView";

const VendorComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [counter, setCounter] = useState(0);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCounter(counter + 1);
  };

  const handleOutsideClick = (event: any) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="p-8 pb-5 mb-5 m-8 space-y-4 bg-white text-black rounded-lg shadow-2xl">
      {!showModal && (
        <button
          onClick={openModal}
          className="w-full py-2 px-4 text-center bg-nova rounded text-white hover:bg-nova-dark outline outline-1 outline-black"
        >
          Add New Vendor
        </button>
      )}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center align-middle z-10"
          onClick={handleOutsideClick}
        >
          <div className="">
            <VendorForm onSubmit={closeModal} onClose={closeModal} />
            {/* <button
              onClick={closeModal}
              className="bg-gray-200 hover:text-red-700 outline outline-1 hover:outline-black text-gray-800 rounded-sm m-1 p-1 outline-gray-400"
            >
              Close
            </button> */}
          </div>
        </div>
      )}
      <VendorView refreshKey={counter} />
      {showModal && (
        <style jsx>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
    </div>
  );
};

export default VendorComponent;
