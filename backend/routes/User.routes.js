const Order = require("../models/Cafe/Cafe_orders");
const Menu = require("../models/Cafe/cafe_menu");

const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { cafeId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    let totalAmount = 0;

    const formattedItems = [];

    for (const item of items) {
      const menuItem = await Menu.findOne({
        _id: item.menuItem,
        cafe_owner: cafeId,
        available: true
      }).session(session);

      if (!menuItem) {
        throw new Error("Invalid or unavailable menu item");
      }

      totalAmount += menuItem.price * item.quantity;

      formattedItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    const order = await Order.create(
      [{
        user: userId,
        cafe: cafeId,
        items: formattedItems,
        totalAmount,
        paymentStatus: "PENDING",
        orderStatus: "PLACED"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(order[0]);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({
      message: error.message || "Failed to place order"
    });
  }
};
// route is post /users/orders

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("cafe", "Name Cafe_Address")
      .populate("items.menuItem", "item_name price")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};  // route is get /users/myorders








