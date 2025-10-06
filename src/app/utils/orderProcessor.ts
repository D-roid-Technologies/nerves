import { salesService } from "../redux/configuration/sales.service";

export const processOrderAndCreateSales = async (order: any) => {
  try {
    console.log("Processing order for sales creation:", order.orderId);

    const success = await salesService.createSaleFromOrder(order);

    if (success) {
      console.log("Sales records created successfully");
      return { success: true, message: "Sales records created successfully" };
    } else {
      throw new Error("Failed to create sales records");
    }
  } catch (error) {
    console.error("Error processing order for sales:", error);
    return { success: false, message: "Failed to create sales records" };
  }
};

export const extractSellerInfoFromOrder = (order: any) => {
  const sellerMap = new Map();

  order.items.forEach((item: any) => {
    if (item.sellerId) {
      sellerMap.set(item.sellerId, {
        sellerId: item.sellerId,
        sellerEmail: item.sellerEmail || `${item.sellerId}@example.com`,
      });
    }
  });

  return Array.from(sellerMap.values());
};

export const validateOrderForSales = (order: any) => {
  if (!order || !order.items || order.items.length === 0) {
    return { isValid: false, error: "Order has no items" };
  }

  if (!order.shippingDetails || !order.paymentDetails) {
    return { isValid: false, error: "Order missing required details" };
  }

  return { isValid: true, error: null };
};

export default {
  processOrderAndCreateSales,
  extractSellerInfoFromOrder,
  validateOrderForSales,
};
