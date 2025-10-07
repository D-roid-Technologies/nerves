import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSales } from "../redux/slice/sales";
import { salesService } from "../redux/configuration/sales.service";

export const SalesInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSalesData = () => {
      try {
        const salesData = salesService.loadSalesFromStorage();
        if (salesData.length > 0) {
          dispatch(setSales(salesData));
          console.log("Sales data loaded:", salesData.length);
        }
      } catch (error) {
        console.error("Error loading sales data:", error);
      }
    };

    initializeSalesData();
  }, [dispatch]);

  return null;
};

export default SalesInitializer;
