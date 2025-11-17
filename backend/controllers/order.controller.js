const db = require("../models");
const { Op } = require("sequelize");
const { sendOrderStatusEmail } = require("../services/email.service");

const Order = db.orders;
const OrderItem = db.orderItems;
const Drug = db.drugs;
const User = db.users;
const Prescription = db.prescriptions;

// User: Create a new order
exports.create = async (req, res) => {
  const { items, shippingAddress, paymentMethod, prescriptionId } = req.body;
  const userId = req.userId;

  if (!items || items.length === 0) {
    return res.status(400).send({ message: "Cart is empty!" });
  }
  if (!shippingAddress || !paymentMethod) {
    return res.status(400).send({ message: "Shipping and payment info are required." });
  }

  // Use a transaction
  const t = await db.sequelize.transaction();
  try {
    let totalPrice = 0;
    let requiresRx = false;
    const drugIds = items.map(item => item.id);
    const drugsInDB = await Drug.findAll({ where: { id: { [Op.in]: drugIds } } }, { transaction: t });
    
    const orderItemsData = [];

    for (const item of items) {
      const drug = drugsInDB.find(d => d.id === item.id);
      if (!drug) {
        throw new Error(`Drug with ID ${item.id} not found.`);
      }
      if (drug.stock < item.quantity) {
        throw new Error(`Not enough stock for ${drug.name}.`);
      }
      if (drug.requiresPrescription) {
        requiresRx = true;
        if (item.quantity > 10) {
          throw new Error(`Cannot order more than 10 units of ${drug.name}.`);
        }
      }

      orderItemsData.push({
        drugId: drug.id,
        quantity: item.quantity,
        pricePerUnit: drug.price
      });
      totalPrice += drug.price * item.quantity;
    }

    if (requiresRx && !prescriptionId) {
      throw new Error("This order requires a prescription ID.");
    }

  
    const order = await Order.create({
      userId: userId,
      prescriptionId: prescriptionId || null,
      totalPrice: totalPrice,
      status: requiresRx ? 'pending_approval' : 'verified', // Auto-verify non-rx
      shippingAddress: JSON.stringify(shippingAddress), // Store as JSON string
      paymentMethod: paymentMethod,
      paymentStatus: 'pending' // Simulate pending payment
    }, { transaction: t });

    for (const itemData of orderItemsData) {
      await OrderItem.create({
        orderId: order.id,
        drugId: itemData.drugId,
        quantity: itemData.quantity,
        pricePerUnit: itemData.pricePerUnit
      }, { transaction: t });

     
      await Drug.decrement('stock', {
        by: itemData.quantity,
        where: { id: itemData.drugId },
        transaction: t
      });
    }

   
    
    await order.update({ paymentStatus: 'completed' }, { transaction: t });

    
    await t.commit();
    
    
    if (order.status === 'verified') {
        const user = await User.findByPk(userId);
        sendOrderStatusEmail(user.email, order.id, 'verified');
    }

    res.send({ message: "Order placed successfully!", orderId: order.id, status: order.status });

  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: "Failed to place order: " + err.message });
  }
};


exports.findByUser = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      include: [{
        model: OrderItem,
        include: [Drug]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.send(orders);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.findAll = async (req, res) => {
  const status = req.query.status; // e.g., /api/orders?status=pending_approval
  let where = {};
  if (status) {
    where.status = status;
  }

  try {
    const orders = await Order.findAll({
      where: where,
      include: [
        { model: User, attributes: ['id', 'email'] },
        { model: Prescription, attributes: ['id', 'imageUrl', 'status'] },
        { model: OrderItem, include: [Drug] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.send(orders);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  const { orderId, status } = req.body; // status: 'verified', 'shipped', 'cancelled', 'completed'

  try {
    const order = await Order.findByPk(orderId, { include: [User] });
    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

   
    sendOrderStatusEmail(order.user.email, order.id, status);

    res.send({ message: `Order status updated to ${status}.` });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};