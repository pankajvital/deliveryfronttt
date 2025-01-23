import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBed } from "react-icons/fa";
import { MdDining, MdOutlineOutdoorGrill } from "react-icons/md";
import { FaReadme } from "react-icons/fa";
import { GiFlowerPot, GiWashingMachine } from "react-icons/gi";
import { FaKitchenSet } from "react-icons/fa6";
import ProductCard from "./ProductCard";

const Hero = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totalSelected, setTotalSelected] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://plusbackend.onrender.com/api/products/getallproducts"
        );
        const allProducts = response.data;
        const filtered = allProducts.filter(
          (product) => product.type === "bedroom"
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleItemClick = async (type) => {
    try {
      const response = await axios.get(
        "https://plusbackend.onrender.com/api/products/getallproducts"
      );
      const allProducts = response.data;
      const filtered = allProducts.filter((product) => product.type === type);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToSelected = (product, newQuantity) => {
    setSelectedItems((prevItems) => {
      const updatedItems = {
        ...prevItems,
        [product._id]: {
          ...product,
          quantity: newQuantity,
        },
      };

      let newTotalSelected = 0;
      let newTotalVolume = 0;

      Object.values(updatedItems).forEach((item) => {
        newTotalSelected += item.quantity;
        newTotalVolume += item.quantity * (item.volume || 0);
      });

      setTotalSelected(newTotalSelected);
      setTotalVolume(parseFloat(newTotalVolume).toFixed(3));

      return updatedItems;
    });
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[productId];

      let newTotalSelected = 0;
      let newTotalVolume = 0;

      Object.values(updatedItems).forEach((item) => {
        newTotalSelected += item.quantity;
        newTotalVolume += item.quantity * (item.volume || 0);
      });

      setTotalSelected(newTotalSelected);
      setTotalVolume(parseFloat(newTotalVolume).toFixed(3));

      return updatedItems;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const resetUserDetails = () => {
    setUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    });
  };

  const handleSendDetails = async () => {
    setIsLoading(true); // Set loading state to true
    const formattedSelectedProducts = Object.values(selectedItems)
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        product: item._id,
        quantity: item.quantity,
        volume: item.volume,
      }));

    // Basic validations for userDetails fields
    if (!userDetails.name || userDetails.name.trim() === "") {
      alert("Please enter a valid name.");
      setIsLoading(false);
      return;
    }

    if (!userDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!userDetails.phone || !/^\d{10,15}$/.test(userDetails.phone)) {
      alert("Please enter a valid phone number (10-15 digits).");
      setIsLoading(false);
      return;
    }

    if (!userDetails.address || userDetails.address.trim() === "") {
      alert("Please enter a valid address.");
      setIsLoading(false);
      return;
    }

    if (!userDetails.message || userDetails.message.trim() === "") {
      alert("Please enter a message.");
      setIsLoading(false);
      return;
    }

    if (formattedSelectedProducts.length === 0) {
      alert("No items with quantity greater than zero.");
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      ...userDetails,
      selectedProducts: formattedSelectedProducts,
      totalVolume,
    };

    console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

    try {
      const response = await axios.post(
        "https://plusbackend.onrender.com/api/users/adduserdetail",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Data sent successfully.");
      resetUserDetails();
      setIsModalOpen(false);

      // Add submission success animation
      // document.querySelector("#submit-button").classList.add("submitted");
      setTimeout(() => {
        // document.querySelector("#submit-button").classList.remove("submitted");
      }, 3000);
    } catch (error) {
      console.error(
        "Error sending details:",
        error.response ? error.response.data : error.message
      );
      // alert("Failed to send details. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false after submission
    }
  };
  
  // workings

  return (
    <div className="flex flex-wrap w-full h-full px-2 py-3 sm:py-5 lg:py-10">
      <div className="w-full lg:w-9/12 h-[80vh] p-4 pl-6 overflow-y-auto">
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { icon: <FaBed />, label: "Bedroom", type: "bedroom" },
            { icon: <MdDining />, label: "Dining", type: "dining" },
            { icon: <FaReadme />, label: "Study", type: "study" },
            { icon: <FaKitchenSet />, label: "Kitchen", type: "kitchen" },
            { icon: <GiWashingMachine />, label: "Laundry", type: "laundry" },
            {
              icon: <MdOutlineOutdoorGrill />,
              label: "Outdoor",
              type: "outdoor",
            },
            { icon: <FaBed />, label: "Bedroom", type: "bedroom" },
            { icon: <MdDining />, label: "Dining", type: "dining" },
            { icon: <FaReadme />, label: "Study", type: "study" },
            { icon: <FaKitchenSet />, label: "Kitchen", type: "kitchen" },
            { icon: <GiWashingMachine />, label: "Laundry", type: "laundry" },
            {
              icon: <MdOutlineOutdoorGrill />,
              label: "Outdoor",
              type: "outdoor",
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item.type)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-sm cursor-pointer hover:bg-[#2A364D] hover:text-white transition-all"
            >
              <div>{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              quantity={selectedItems[product._id]?.quantity || 0}
              onSelect={handleAddToSelected}
            />
          ))}
        </div>
      </div>

      <div className="w-full lg:w-3/12 h-[90vh] p-4">
        <div className="max-w-full p-4 h-[20vh] bg-gray-200 rounded-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <p className="text-[#2A364D] font-semibold text-lg mb-2">
            Your Selected List
          </p>
          <div className="flex justify-between">
            <p className="font-semibold text-sm text-gray-700">
              {totalSelected} Selected item(s)
            </p>
            {Object.keys(selectedItems).length > 0 && (
              <div
                className="px-2 font-semibold hover:cursor-pointer text-[#2A364D]"
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? "SHOW LESS" : "SHOW MORE"}
              </div>
            )}
          </div>

          {show && (
            <div className="mt-2">
              {Object.values(selectedItems)
                .filter((item) => item.quantity > 0) // Exclude items with zero quantity
                .map((item, index) => (
                  <div key={item._id} className="mt-1">
                    <div className="flex justify-between items-center text-sm">
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-normal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 font-semibold hover:text-red-700 transition"
                        >
                          [X]
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {totalSelected > 0 ? (
          <div className="bg-gray-200 rounded-md p-4 mt-4">
            <p className="text-sm">
              Based on the information you have indicated your airspace totaling
              to:
            </p>
            <p className="text-3xl font-semibold text-center">
              {totalVolume} m<sup>3*</sup>
            </p>
            <div className="flex bg-white max-h-full p-2 rounded-sm flex-col items-center mt-4">
              {totalVolume < 16 ? (
                <img
                  src="/small-truck.jpg"
                  alt="small_truck"
                  className="w-3/4 h-40 object-contain"
                />
              ) : totalVolume < 30 ? (
                <img
                  src="/medium-truck.jpg"
                  alt="medium_truck"
                  className="w-3/4 h-40 object-contain"
                />
              ) : (
                <img
                  src="/large-truck.jpg"
                  alt="large_truck"
                  className="w-3/4 h-40 object-contain"
                />
              )}
              <p className="text-2xl font-semibold mt-2">
                {totalVolume < 16
                  ? "4T Truck"
                  : totalVolume < 30
                  ? "8T Truck"
                  : "16T Truck"}
              </p>
              <p className="text-sm text-gray-700 mt-2">(Approximate only)</p>
              <div className="w-full max-h-full p-1.5 bg-[#50AAB2] mt-8 hover:bg-[#212529] hover:border-gray-800 transition duration-300 rounded-md">
                <button
                  className="w-full p-1 text-white font-semibold hover:bg-[#212529] hover:border-[#212529] transition duration-300"
                  onClick={() => setIsModalOpen(true)}
                >
                  SEND ME DETAILS
                </button>
              </div>
            </div>
          </div>
        ) : (
          <> </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-md w-full sm:w-96">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={userDetails.name}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={userDetails.address}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={userDetails.message}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
      id="submit-button"
      type="button"
      onClick={handleSendDetails}
      className={`px-4 py-2 text-white rounded-md ${
        isLoading ? "bg-gray-400" : "bg-blue-500"
      }`}
      disabled={isLoading} // Disable button while loading
    >
      {isLoading ? (
        <div className="flex items-center">
         
          Submitting...
        </div>
      ) : (
        "Submit"
      )}
    </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
