const express = require("express");
const router = express.Router();

const authCafe = require("../middlewares/authCafe");
const cafeApproved = require("../middlewares/cafeApproved");

const {
  registerCafe,
  approveCafe,
  Logincafe,
  updateCafe,
  deleteCafe,
  getCafeById,
  MenuItem,
  EditMenuItem,
  toggleMenuAvailability,
  deleteItem,
  getItems,
  getItemById,
  getCafeOrders,
  updateOrderStatus,
  collectPayment,
  getCafeTotalAmount
} = require("../controllers/cafe.controller");

const upload = require("../middlewares/upload");

router.post(
  "/register",
  upload.fields([
    { name: "Cafe_photos", maxCount: 5 },
    { name: "upi_photo", maxCount: 1 }
  ]),
  registerCafe
);

router.patch("/approve/:id", approveCafe);
router.post("/login", Logincafe);
router.put("/editprofile", authCafe, cafeApproved, updateCafe);
router.get("/cafedetail",authCafe, cafeApproved,getCafeById);
router.get("/cafe/cafedetail", cafeApproved, getCafeById);
router.delete("/delete/cafe",  authCafe,cafeApproved, deleteCafe); // -- last one to test

router.post("/menuItem/cafe", authCafe, cafeApproved, MenuItem);
router.put("/menuItem/edit/:id", authCafe, cafeApproved, EditMenuItem);
router.patch("/menuItem/availability/:id",authCafe, cafeApproved,  toggleMenuAvailability);
router.delete("/delete/item/:itemid",  authCafe,cafeApproved, deleteItem);

router.get("/cafe/items", authCafe,cafeApproved,  getItems);
router.get("/cafe/:menuId", authCafe, cafeApproved, getItemById);

router.get("/orders/cafe", authCafe, cafeApproved, getCafeOrders);
router.patch("/cafe/orders/status", cafeApproved, authCafe, updateOrderStatus);
router.post("/orders/:orderId/collect-payment", cafeApproved, authCafe, collectPayment);
router.get("/orders/cafe/total", cafeApproved, authCafe, getCafeTotalAmount);

router.get("/dashboard", authCafe, cafeApproved, (req, res) => {
  res.json({ message: "Welcome to cafe dashboard" });
});

module.exports = router;
