import { auth } from "../../firebase";
import { store } from "../store";
import { addSale, SaleItem } from "../slice/sales";
import { authService } from "./auth.service";

export class SalesService {
  async createSaleFromOrder(order: any) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No user logged in");
        return false;
      }

      console.log("Creating sales from order:", order.orderId);

      // Fetch all items to get seller information
      const allItems = await authService.fetchAllListedItems();
      console.log("Total items available:", allItems.length);

      let salesCreated = 0;

      // Process each item in the order
      for (const item of order.items) {
        console.log("Processing item:", item.name);

        // Find the original item to get seller information
        const originalItem = allItems.find((listedItem: any) => {
          const itemIdMatch =
            String(listedItem.id) === String(item.id) ||
            String(listedItem.itemId) === String(item.id);

          const nameMatch =
            listedItem.title === item.name || listedItem.name === item.name;

          return itemIdMatch || nameMatch;
        });

        if (!originalItem) {
          console.warn("Original item not found for:", item.name);
          continue;
        }

        // Extract seller information
        let sellerId = "unknown";
        let sellerEmail = "unknown@example.com";

        if (originalItem.sellerId) {
          if (
            typeof originalItem.sellerId === "object" &&
            originalItem.sellerId !== null
          ) {
            sellerId =
              originalItem.sellerId.uid ||
              originalItem.sellerId.email ||
              "unknown";
            sellerEmail = originalItem.sellerId.email || "unknown@example.com";
          } else {
            sellerId = String(originalItem.sellerId);
            sellerEmail = String(originalItem.sellerId).includes("@")
              ? String(originalItem.sellerId)
              : originalItem.sellerEmail || "unknown@example.com";
          }
        } else if (originalItem.sellerEmail) {
          sellerEmail = originalItem.sellerEmail;
          sellerId = originalItem.sellerEmail;
        }

        console.log("Seller info:", { sellerId, sellerEmail });

        // Create sale record
        const sale: SaleItem = {
          id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          itemId: String(item.id || originalItem.id || `item-${Date.now()}`),
          title: item.name || originalItem.title || originalItem.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          image:
            item.image ||
            originalItem.image ||
            originalItem.thumbnail ||
            undefined,
          buyerId: currentUser.uid,
          buyerEmail: currentUser.email || "unknown@example.com",
          sellerId: sellerId,
          sellerEmail: sellerEmail,
          soldAt: new Date().toISOString(),
          status: "completed",
          totalAmount: (item.discountPrice || item.price) * item.quantity,
          category: originalItem.category,
        };

        // Dispatch to Redux store
        store.dispatch(addSale(sale));
        salesCreated++;

        console.log("Sale created:", sale.title);
      }

      // Save to localStorage after processing all items
      if (salesCreated > 0) {
        this.saveSalesToStorage();
        console.log(`${salesCreated} sales created and saved`);
      }

      return true;
    } catch (error) {
      console.error("Error creating sales from order:", error);
      return false;
    }
  }

  getSalesForCurrentUser() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return [];
    }

    const state = store.getState();
    const salesData = state.sales.sales || [];

    const userSales = salesData.filter((sale: SaleItem) => {
      return (
        sale.sellerId === currentUser.uid ||
        sale.sellerEmail === currentUser.email ||
        sale.sellerId === currentUser.email
      );
    });

    return userSales;
  }

  addTestSales() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user logged in for test sales");
      return;
    }

    const testSales: SaleItem[] = [
      {
        id: `test-sale-${Date.now()}-1`,
        itemId: "test-item-1",
        title: "Wireless Bluetooth Headphones",
        price: 25000,
        quantity: 2,
        image: undefined,
        buyerId: "test-buyer-1",
        buyerEmail: "buyer1@example.com",
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email || "seller@example.com",
        soldAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        totalAmount: 50000,
        category: "Electronics",
      },
      {
        id: `test-sale-${Date.now()}-2`,
        itemId: "test-item-2",
        title: "Smart Watch Series 5",
        price: 45000,
        quantity: 1,
        image: undefined,
        buyerId: "test-buyer-2",
        buyerEmail: "buyer2@example.com",
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email || "seller@example.com",
        soldAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        totalAmount: 45000,
        category: "Electronics",
      },
      {
        id: `test-sale-${Date.now()}-3`,
        itemId: "test-item-3",
        title: "Gaming Laptop",
        price: 320000,
        quantity: 1,
        image: undefined,
        buyerId: "test-buyer-3",
        buyerEmail: "buyer3@example.com",
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email || "seller@example.com",
        soldAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        totalAmount: 320000,
        category: "Electronics",
      },
    ];

    testSales.forEach((sale) => {
      store.dispatch(addSale(sale));
    });

    this.saveSalesToStorage();
    console.log("Test sales added:", testSales.length);
  }

  private saveSalesToStorage() {
    try {
      const state = store.getState();
      const salesData = state.sales.sales;
      localStorage.setItem("nerves_sales", JSON.stringify(salesData));
    } catch (error) {
      console.error("Error saving sales to localStorage:", error);
    }
  }

  loadSalesFromStorage(): SaleItem[] {
    try {
      const savedSales = localStorage.getItem("nerves_sales");
      if (savedSales) {
        const salesData = JSON.parse(savedSales);
        return salesData;
      }
    } catch (error) {
      console.error("Error loading sales from localStorage:", error);
    }
    return [];
  }

  clearAllSales() {
    localStorage.removeItem("nerves_sales");
  }
}

export const salesService = new SalesService();
