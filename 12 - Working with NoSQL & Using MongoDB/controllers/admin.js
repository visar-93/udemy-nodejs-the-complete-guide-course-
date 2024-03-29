const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // console.log('In another middleware!');
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title, 
    price, 
    description, 
    imageUrl, 
    null, 
    req.user._id
    );
  product.save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};


exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // Product.findByPk(prodId).
  Product.findById(prodId)
  .then(product => {
    if(!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', { 
        pageTitle: 'Edit Product', 
        path: '/admin/edit-product', 
        editing: editMode,
        product: product
    });
  })
  .catch( err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updateImgUrl = req.body.imageUrl;
  const updateDesc = req.body.description;
 
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updateDesc,
    updateImgUrl,
    prodId
  );
  product.save()
 .then(result => {
   console.log('UPDATED PRODUCT');
   res.redirect('/admin/products');
 }) 
 .catch(err=> console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products'); 
  })
  .catch(err => console.log(err));

  // req.user.getProducts({where: {id: prodId}}) //req.user.getProducts returns array
  // .then( products => {
  //   const product = products[0];
  //   return product.destroy();
  // })
  // .then(result => {
  //   console.log('DESTROYED PRODUCT');
  //   res.redirect('/admin/products'); 
  // })
  // .catch(err => console.log(err));
};
