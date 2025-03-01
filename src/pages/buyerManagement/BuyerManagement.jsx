import React, { useEffect, useState } from "react";
import { getBuyers } from "../../services/buyerService";

const BuyerManagement = () => {
  const [buyers, setBuyers] = useState([]);

  const fetchBuyers = async () => {
    try {
      const response = await getBuyers();
      setBuyers(response.data);
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return <div>BuyerManagement</div>;
};

export default BuyerManagement;
