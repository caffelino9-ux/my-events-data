const Cafe = require("../models/Cafe/Cafe_login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Menu=require("../models/Cafe/cafe_menu")
const Order = require("../models/Cafe/Cafe_orders")
const CashCollection=require("../models/Cafe/Collection_cafe")
const uploadBuffer = require("../utils/uploadToCloudinary");


//REGISTER CAFE 
const registerCafe = async (req, res) => {
  try {
    const {
      Name,
      Cafe_Address,
      cafe_location,
      Cafe_type,
      Average_Cost,
      AboutCafe,
      password,
      managerName,
      Phonenumber,
      designation,
      AlternateContact,
      email_address_manager,
      paymentMethods,
      opening_hours
    } = req.body;

    if (!Name || !Cafe_Address || !cafe_location || !Cafe_type ||
        !Average_Cost || !password || !managerName ||
        !Phonenumber || !email_address_manager) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    const exists = await Cafe.findOne({ email_address_manager });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // 🔹 Upload cafe photos
    const Cafe_photos = [];
    if (req.files?.Cafe_photos) {
      for (const file of req.files.Cafe_photos) {
        const url = await uploadBuffer(file.buffer, "cafes/photos");
        Cafe_photos.push(url);
      }
    }

    if (Cafe_photos.length < 5)
      return res.status(400).json({ message: "Minimum 5 cafe photos required" });

    // 🔹 Upload UPI photo
    if (!req.files?.upi_photo)
      return res.status(400).json({ message: "UPI photo is required" });

    const upi_photo = await uploadBuffer(
      req.files.upi_photo[0].buffer,
      "cafes/upi"
    );

    const hashedPwd = await bcrypt.hash(password, 10);

    const cafe = await Cafe.create({
      Name,
      Cafe_Address,
      cafe_location,
      Cafe_type,
      Average_Cost,
      AboutCafe,
      password: hashedPwd,
      managerName,
      Phonenumber,
      designation,
      AlternateContact,
      email_address_manager,
      paymentMethods,
      opening_hours: JSON.parse(opening_hours || "{}"),
      Cafe_photos,
      upi_photo,
      status: false,
      role: "cafe"
    });

    const token = jwt.sign(
      { id: cafe._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie('token', token, {
      httpOnly: true,
       secure: false,   //process.env.NODE_ENV === 'production',-- for production
      sameSite: 'lax', //for production is strict
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: "Cafe registered successfully. Waiting for admin approval."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//Cafelio vardhanleo@gmail.com password123
//id : 696679db2ee5e5ae201de76e

const Logincafe = async (req, res) => {
  const { cafename, email, password } = req.body;
  console.log("req.body ===>", req.body);

  try {
    if (!cafename || !email || !password) return res.status(400).json({ message: "Please fill the form in detail" });

    const cafe = await Cafe.findOne({ Name: cafename, email_address_manager: email });
    if (!cafe) return res.status(400).json({ message: `Cafe Not found with name ${cafename}` });

    if (cafe.status !== true) {
      return res.status(403).json({
        message: "Cafe not approved by admin yet"
      });
    }

    const match = await bcrypt.compare(password, cafe.password);
    if (!match) return res.status(401).json({ message: "Incorrect Password !!! Check Again !!!!" });

    const token = jwt.sign({ id: cafe._id }, 'secret', { expiresIn: '1d' });

    
    res.cookie('token', token, {
      httpOnly: true,
       secure: false,   //process.env.NODE_ENV === 'production',-- for production
      sameSite: 'lax', //for production is strict
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful !!!",
      cafe,
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.cafe.id);
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });

    Object.assign(cafe, req.body);

    if (req.body.password) {
      cafe.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.files?.Cafe_photos) {
      const photos = [];
      for (const file of req.files.Cafe_photos) {
        photos.push(await uploadBuffer(file.buffer, "cafes/photos"));
      }
      if (photos.length < 5)
        return res.status(400).json({ message: "Minimum 5 cafe photos required" });

      cafe.Cafe_photos = photos;
    }

    if (req.files?.upi_photo) {
      cafe.upi_photo = await uploadBuffer(
        req.files.upi_photo[0].buffer,
        "cafes/upi"
      );
    }

    await cafe.save();

    const { password, ...safeCafe } = cafe.toObject();
    res.status(200).json({ message: "Cafe updated", cafe: safeCafe });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(req.cafe.id);
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });

    res.clearCookie("token");
    res.status(200).json({ message: "Cafe deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCafeById=async(req,res)=>{
  try{
const cafeId=req.cafe.id;

const cafe=await Cafe.findById(cafeId)

if(!cafe){
  return res.status(404).json({"message":"Cafe Not found"})
}

return res.status(200).json({message:"Data retrieved",data:cafe})

  }catch(error){
    console.error(error)
    return res.status(500).json({message:error.message})
  }
}

const MenuItem = async (req, res) => {
  const {
    item_name,
    Category,
    food_type,
    price,
    description_food,
    image_url
  } = req.body;

  const cafeId = req.cafe.id;

  try {
    if (!item_name || !Category || !food_type || price === undefined) {
      return res.status(400).json({
        message: "Fill required details"
      });
    }

    const menuItem = await Menu.create({
      item_name,
      Category,
      food_type,
      price,
      description_food,
      image_url,
      cafe_owner: cafeId
    });

    return res.status(201).json({
      message: "Menu item created successfully",
      data: menuItem
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const EditMenuItem=async(req,res)=>{
  const {
    item_name,
    Category,
    food_type,
    price,
    description_food,
    image_url
  } = req.body;
  const cafeId = req.cafe.id;
  const {id}=req.params
  try{
  const cafe = await Cafe.findById(cafeId);
  if(!cafe) return res.status(404).json({"message":"Cafe not found"})
    const menuItem=await Menu.findOne({
  _id:id,
  cafe_owner:cafeId
    })

     if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found or unauthorized"
      });
    }

    if (item_name !== undefined) menuItem.item_name = item_name;
    if (Category !== undefined) menuItem.Category = Category;
    if (food_type !== undefined) menuItem.food_type = food_type;
    if (price !== undefined) menuItem.price = price;
    if (description_food !== undefined) menuItem.description_food = description_food;
    if (image_url !== undefined) menuItem.image_url = image_url;
  
    await menuItem.save();

    return res.status(200).json({
      message: "Menu item updated successfully",
      data: menuItem
    });

  }catch(error){
     console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
}

const approveCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );

    if (!cafe) return res.status(404).json({ message: "Cafe not found" });

    res.json({
      success: true,
      message: "Cafe approved successfully",
      cafe,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleMenuAvailability = async (req, res) => {
  const { id } = req.params; // menu item id

  try {
    const cafeId = req.cafe.id; // from cookie auth middleware

    const menuItem = await Menu.findOne({
      _id: id,
      cafe_owner: cafeId
    });

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found or unauthorized"
      });
    }

    //TOGGLE availability
    menuItem.available = !menuItem.available;

    await menuItem.save();

    return res.status(200).json({
      message: "Availability updated",
      available: menuItem.available
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  const { itemid } = req.params;

  try {
    const cafeId = req.cafe.id;

    const menuItem = await Menu.findOne({
      _id: itemid,
      cafe_owner: cafeId
    });

    if (!menuItem) {
      return res.status(404).json({
        message: "Item not found or unauthorized"
      });
    }

    await Menu.deleteOne({ _id: itemid });

    return res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to delete item"
    });
  }
};

const getItems = async (req, res) => {
  try {
    const cafeId = req.cafe.id; // from JWT cookie

    const items = await Menu.find({ cafe_owner: cafeId })
      .sort({ createdAt: -1 }).populate("cafe_owner","Name  Cafe_Address cafe_location Cafe_type Average_Cost AboutCafe  managerName Phonenumber designation AlternateContact email_address_manager paymentMethods opening_hours");

    return res.status(200).json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch menu items"
    });
  }
};


const getItemById = async (req, res) => {
  try {
    const cafeId = req.cafe.id;
    const { menuId } = req.params;

    const item = await Menu.findOne({
      _id: menuId,
      cafe_owner: cafeId
    }).populate(
      "cafe_owner",
      "Name Cafe_Address cafe_location Cafe_type Average_Cost AboutCafe managerName Phonenumber designation AlternateContact email_address_manager paymentMethods opening_hours"
    );

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json(item);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch menu item"
    });
  }
};

const getCafeOrders = async (req, res) => {
  try {
    const cafeId = req.cafe.id;

    const orders = await Order.find({ cafe: cafeId })
      .populate("user", "name phone")
      .populate("items.menuItem", "item_name")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cafe orders" });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const cafeId = req.cafe.id;
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, cafe: cafeId },
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);

  } catch (error) {
    return res.status(500).json({ message: "Failed to update order" });
  }
};



const collectPayment = async (req, res) => {
  try {
    const cafeId = req.cafe.id; // from cookie auth
    const { orderId } = req.params;
    const { paymentMode, collectedAmount } = req.body;

    if (!paymentMode || !collectedAmount) {
      return res.status(400).json({ message: "Payment mode & amount required" });
    }

    // 1️⃣ Find order belonging to this cafe
    const order = await Order.findOne({ _id: orderId, cafe: cafeId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Update order payment details
    order.paymentStatus = "PAID";
    order.paymentMethod = paymentMode;
    await order.save();

    // 3️⃣ Create cash collection entry
    const collection = await CashCollection.create({
      order: order._id,
      expectedAmount: order.totalAmount,
      collectedAmount,
      status:
        collectedAmount < order.totalAmount ? "PARTIAL" : "COLLECTED",
      Mode: paymentMode,
      cafe: cafeId
    });

    return res.status(200).json({
      message: "Payment collected successfully",
      order,
      collection
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to collect payment"
    });
  }
};

const getCafeTotalAmount = async (req, res) => {
  try {
    const cafeId = req.cafe.id;

    const result = await Order.aggregate([
      {
        $match: {
          cafe: new mongoose.Types.ObjectId(cafeId),
          paymentStatus: "PAID"
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    return res.status(200).json({
      totalAmount: result[0]?.totalAmount || 0
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch total amount"
    });
  }
};



//file uploading using cloudinary





module.exports = { registerCafe, Logincafe, approveCafe,updateCafe,deleteCafe,getCafeById,MenuItem,EditMenuItem,toggleMenuAvailability
  ,deleteItem,getItems,getItemById,getCafeOrders,updateOrderStatus,collectPayment,getCafeTotalAmount};