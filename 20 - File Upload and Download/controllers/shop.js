const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");
const product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir ,'views', 'shop.html'));
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      // console.log(user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
          totalPrice: i.quantity * i.productId.price,
        };
      });
      let totalOrder = 0;
      const totalOrder1 = products.forEach((i) => {
        totalOrder += i.totalPrice;
      });
      // console.log(price);

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
        totalOrder: totalOrder,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found!"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res); // pipe - forward read  data from stream to res(response), response object is a writable stream

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });

      order.products.forEach((prod, index) => {

      pdfDoc.moveDown();
        pdfDoc.fontSize(18).text(`#${index + 1}`);
        pdfDoc
          .fontSize(15)
          .text("________________________________________________________");

        const pdfList = [
          `Product Name: ${prod.product.title}`,
          `Quantity: ${prod.quantity}`,
          `Unit Price: $${prod.product.price}`,
        ];

      pdfDoc.moveDown();


        pdfDoc.fontSize(15).list(pdfList, {
          listType: "none",
          align: "right",
        });

      pdfDoc.moveDown();


        pdfDoc.fontSize(17).text(`TotalPrice: $${prod.totalPrice}`, {
          align: "right",
          underline: true,
        });
        pdfDoc
          .fontSize(15)
          .text("________________________________________________________");
      });
      pdfDoc.text("");

      pdfDoc.moveDown();

      pdfDoc.fontSize(22).fillColor('red').text(`Total Order: $ ${ order.totalOrder}`, {
        align: "right",
        underline: true,
      });

      // Course Solution
      // let totalPrice = 0;
      // order.products.forEach(prod => {
      //   totalPrice = order.totalOrder;
      //   pdfDoc
      //   .fontSize(14)
      //   .text(
      //     prod.product.title +
      //     ' - ' +
      //     prod.quantity +
      //     ' x ' +
      //     '$' +
      //     prod.product.price
      //     );
      // });
      // pdfDoc.text('---')
      // pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();

      //   fs.readFile(invoicePath, (err, data) => {
      //     if (err) {
      //       return next(err);
      //     }
      //     res.setHeader('Content-Type', 'application/pdf');
      //     res.setHeader(
      //       'Content-Disposition',
      //       'inline; filename="' + invoiceName + '"'
      //     );
      //     res.send(data);
      //   });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);
    })
    .catch((err) => {
      next(err);
    });
};
