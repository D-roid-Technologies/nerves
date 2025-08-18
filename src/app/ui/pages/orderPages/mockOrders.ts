
export interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  status:
    | "paid"
    | "sealed"
    | "dispatched"
    | "arrived"
    | "confirmed"
    | "returned"
    | "reviewed";
  items: OrderItem[];
  total: string;
  date: string;
  paymentMethod: string;
  trackingNumber?: string;
  shippingAddress?: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    status: "paid",
    items: [
      {
        name: "Wireless Headphones Pro",
        price: "$129.99",
        quantity: 1,
        image: "/images/headphones.jpg",
      },
      {
        name: "Charging Cable",
        price: "$12.99",
        quantity: 2,
        image: "/images/cable.jpg",
      },
    ],
    total: "$155.97",
    date: "2023-06-15",
    paymentMethod: "Visa •••• 4242",
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
  },
  {
    id: "ORD-1002",
    status: "sealed",
    items: [
      {
        name: "Smart Watch Series 5",
        price: "$199.99",
        quantity: 1,
        image: "/images/watch.jpg",
      },
    ],
    total: "$209.98",
    date: "2023-06-18",
    paymentMethod: "PayPal",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
  },
  {
    id: "ORD-1003",
    status: "dispatched",
    items: [
      {
        name: "Bluetooth Speaker X2",
        price: "$59.99",
        quantity: 2,
        image: "/images/speaker.jpg",
      },
    ],
    total: "$129.98",
    date: "2023-06-20",
    paymentMethod: "Mastercard •••• 5555",
    trackingNumber: "UPS-1Z999AA0392345678",
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    id: "ORD-1004",
    status: "arrived",
    items: [
      {
        name: "USB-C Cable Pack",
        price: "$12.99",
        quantity: 3,
        image: "/images/usb-c.jpg",
      },
      {
        name: "Phone Stand",
        price: "$8.99",
        quantity: 1,
        image: "/images/stand.jpg",
      },
    ],
    total: "$48.96",
    date: "2023-06-22",
    paymentMethod: "American Express •••• 1005",
    trackingNumber: "FED-123456789012",
    shippingAddress: "321 Elm Blvd, Houston, TX 77001",
  },
  {
    id: "ORD-1005",
    status: "confirmed",
    items: [
      {
        name: "Wireless Earbuds Lite",
        price: "$79.99",
        quantity: 1,
        image: "/images/earbuds.jpg",
      },
    ],
    total: "$89.98",
    date: "2023-06-25",
    paymentMethod: "Visa •••• 1234",
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
  },
  {
    id: "ORD-1006",
    status: "returned",
    items: [
      {
        name: "Laptop Backpack Pro",
        price: "$49.99",
        quantity: 1,
        image: "/images/backpack.jpg",
      },
    ],
    total: "$59.98",
    date: "2023-06-28",
    paymentMethod: "PayPal",
    shippingAddress: "987 Cedar Ln, Philadelphia, PA 19101",
  },
  {
    id: "ORD-1007",
    status: "reviewed",
    items: [
      {
        name: "Phone Case Ultra",
        price: "$19.99",
        quantity: 1,
        image: "/images/case.jpg",
      },
      {
        name: "Screen Protector",
        price: "$9.99",
        quantity: 1,
        image: "/images/protector.jpg",
      },
    ],
    total: "$39.98",
    date: "2023-06-30",
    paymentMethod: "Mastercard •••• 8888",
    shippingAddress: "147 Walnut St, San Antonio, TX 78201",
  },
  {
    id: "ORD-1008",
    status: "paid",
    items: [
      {
        name: "Fitness Tracker",
        price: "$89.99",
        quantity: 1,
        image: "/images/tracker.jpg",
      },
    ],
    total: "$99.98",
    date: "2023-07-02",
    paymentMethod: "Discover •••• 1212",
    shippingAddress: "258 Birch Ave, San Diego, CA 92101",
  },
  {
    id: "ORD-1009",
    status: "sealed",
    items: [
      {
        name: "External Hard Drive 1TB",
        price: "$59.99",
        quantity: 1,
        image: "/images/harddrive.jpg",
      },
    ],
    total: "$69.98",
    date: "2023-07-05",
    paymentMethod: "Visa •••• 4321",
    shippingAddress: "369 Spruce Way, Dallas, TX 75201",
  },
  {
    id: "ORD-1010",
    status: "dispatched",
    items: [
      {
        name: "Wireless Keyboard",
        price: "$39.99",
        quantity: 1,
        image: "/images/keyboard.jpg",
      },
      {
        name: "Wireless Mouse",
        price: "$29.99",
        quantity: 1,
        image: "/images/mouse.jpg",
      },
    ],
    total: "$79.98",
    date: "2023-07-08",
    paymentMethod: "PayPal",
    trackingNumber: "USPS-9200199999977453249892",
    shippingAddress: "753 Redwood Blvd, San Jose, CA 95101",
  },
];
