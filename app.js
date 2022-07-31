
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(cors())

const womensShoesTypes = [
  {name: "Women's Trainers", url:"trainers"},
  {name: "Women's Boots", url: "boots"},
  {name: "Golden Shoe Special", url:"special"},
]

let baskets = [
  {sessionToken: "1", products:[]}
]

const products = [
  {id: 1, availableSizes: [{size: "UK 3", quantity: 2},{size: "UK 4", quantity: 1},{size: "UK 5", quantity: 5},{size: "UK 6", quantity: 3}] ,tags: ["womens","trainers"], name: "Kicker Mk1", img: "kickermkone.jpg", price: 50, description: "This shoe lets you kick footballs real good!"},
  {id: 2, availableSizes: [{size: "UK 4", quantity: 9},{size: "UK 5", quantity: 2},{size: "UK 6", quantity: 1}], tags: ["womens","trainers"], name: "Trainer Mk1", img: "trainermkone.jpg", price: 60, description: "They're good for running !"},
  {id: 3, availableSizes: [{size: "UK 3", quantity: 3},{size: "UK 5", quantity: 10},{size: "UK 6", quantity: 2}], tags: ["womens","trainers"], name: "Trainer Mk2", img: "trainermktwo.jpg", price: 80, description: "They're good for almost everything!"},
  {id: 4, availableSizes: [{size: "UK 3", quantity: 5},{size: "UK 4", quantity: 11},{size: "UK 5", quantity: 7}], tags: ["womens","trainers"], name: "Trainer Mk3", img: "trainermkthree.jpg", price: 150, description: "If we were allowed to we would tell you that these are so good, you could walk to the moon with those on!"},
  
  {id: 5, availableSizes: [{size: "UK 3", quantity: 5},{size: "UK 4", quantity: 6},{size: "UK 6", quantity: 7}], tags: ["womens","boots"], name: "Fancy Boots", img: "fancyboots.jpg", price: 90, description: "These boots are our only fancy boots, making them our fanciest as well!"},
  {id: 6, availableSizes: [{size: "UK 3", quantity: 4},{size: "UK 4", quantity: 3},{size: "UK 5", quantity: 8},{size: "UK 6", quantity: 9}], tags: ["womens","boots"], name: "Goth Boots", img: "gothboots.jpg", price: 89, description: "Awaken the goth within you."},
  {id: 7, availableSizes: [], tags: ["womens","boots"], name: "Walking Boots", img: "walkingboots.jpg", price: 100, description: "they're actually NOT made for walking. We have yet to figure out their proper use."},
  
  {id: 8, availableSizes: [{size: "UK 4", quantity: 2}], tags: ["womens","special", "boots"], name: "Golden Boot", img: "goldenboots.jpg", price: 300, description: "These boots are made out of solid gold, we recommend never wearing them for safety reasons."},
  {id: 9, availableSizes: [{size: "UK 5", quantity: 1}], tags: ["womens","special", "trainers"], name: "Golden Shoes", img: "goldenshoes.png", price: 330, description: "These shoes are made out of solid gold, we recommend never wearing them for safety reasons."},
]

const vouchers = [
  {sessionToken: "1", voucherCode: "GOLD2022", priceReduction: 0.1, expiryDate: "2022-07-28T03:24:00"},
  {sessionToken: "1", voucherCode: "GOLD20%", priceReduction: 0.2, expiryDate: "2022-08-01T03:24:00"},
  {sessionToken: "1", voucherCode: "GOLD20%", priceReduction: 0.2, expiryDate: "2022-08-02T03:24:00"},
  {sessionToken: "1", voucherCode: "GOLD50%", priceReduction: 0.5, limit: 50,expiryDate: "2022-08-02T03:24:00"},
]

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/listWomensShoeTypes', (req, res) => {
  setTimeout(function() {
    res.status(200).json(womensShoesTypes)
  }, 300);
})

app.get('/getProductById',(req, res) => {
  // console.log(req.query);
  const returnedProduct = products.find(e => e.id == req.query["id"])
  // console.log(returnedProduct);
  setTimeout(function() {
    res.status(200).json(returnedProduct)
  }, 300);
})

app.post('/getProductByCriteria', (req, res) => {
  var returnObj= []
  // console.log(req.body);
  const criteria = req.body
  products.forEach(e => { 
    let hasAllTags = true
    criteria.forEach(f => {
      if(!e.tags.includes(f)){
        hasAllTags = false;
      }
    })
    hasAllTags ? returnObj.push(e) : null
  })
  // console.log(returnObj);
  setTimeout(function() {
    res.status(200).json(returnObj)
  }, 300);
})


app.post('/addProductToBasket', (req, res) => {
  let productCount = -1;
  if(baskets.find(e => e.sessionToken == (req.body.sessionToken ? req.body.sessionToken : 1))){
    //found existing basket
    const basketIndex = baskets.findIndex(e => e.sessionToken == (req.body.sessionToken ? req.body.sessionToken : 1))
    //is item with same size already in basket ?
    // console.log(baskets[basketIndex].products.findIndex(e => e.product.id == req.body.product.id));
    if(baskets[basketIndex].products.find(e => e.product.id == req.body.product.id && e.selectedSize == req.body.size)){
      const productIndex = baskets[basketIndex].products.findIndex(e => e.product.id == req.body.product.id && e.selectedSize == req.body.size)
      //if yes then qty ++
      // console.log(baskets[basketIndex].products[productIndex]);
      if (baskets[basketIndex].products[productIndex].quantity == products.find(e => baskets[basketIndex].products[productIndex].product.id == e.id ).availableSizes.find(x => x.size == baskets[basketIndex].products[productIndex].selectedSize).quantity) {
        console.log('too many items');
      } else {
        baskets[basketIndex].products[productIndex].quantity+=1
        productCount = baskets[basketIndex].products.length
      }
    } else {
      //if not add it at qty 1
      baskets[basketIndex].products.push({product: req.body.product, selectedSize: req.body.size, quantity: 1})
      productCount = baskets[basketIndex].products.length
    }
  } else {
    //create basket then insert product
    baskets.push({sessionToken: req.body.sessionToken, products: []})
    const basketIndex = baskets.findIndex(e => e.sessionToken == (req.body.sessionToken ? req.body.sessionToken : 1))
    baskets[basketIndex].products.push({product: req.body.product, selectedSize: req.body.size, quantity: 1})
    productCount = baskets[basketIndex].products.length
  }
  console.log(baskets[0].products);
  setTimeout(function() {
    res.status(200).json({productCount: productCount})
  }, 300);
})

app.get('/getBasket', (req, res) => {
  const productsInBasket = baskets.find(e => e.sessionToken == (req.body.sessionToken ? req.body.sessionToken : 1))
  // console.log(productsInBasket.products);
  //return up to date info on products in basket, only return info on available sizes related to the selected size
  const returnedProducts = productsInBasket.products.map(item => {
    const quantityOfSameSizeAvailable = products.find(e => e.id == item.product.id).availableSizes.find(w=>w.size==item.selectedSize)
    return {quantityOfSameSizeAvailable: quantityOfSameSizeAvailable.quantity, product: {id:item.product.id, name: item.product.name, img: item.product.img, price: item.product.price}, quantity: item.quantity, selectedSize: item.selectedSize}
  })
  console.log(returnedProducts);
  setTimeout(function() {
    res.status(200).json(returnedProducts && returnedProducts.length > 0 ? returnedProducts : [])
  }, 300);
})

app.get('/checkVoucher', (req, res) => {
  // console.log(req.query);
  const voucherCode = req.query.voucherCode
  // console.log(voucherCode);
  const sessionToken = (req.query.sessionToken ? req.query.sessionToken : "1")
  const nowEpoch = Date.now()
  console.log(vouchers.findIndex(e => e.sessionToken == sessionToken && e.voucherCode == voucherCode));
  const voucherIndex = vouchers.findIndex(e => e.sessionToken == sessionToken && e.voucherCode == voucherCode && nowEpoch < new Date(e.expiryDate).valueOf())
  console.log("voucherIndex : ", voucherIndex, voucherCode);
  setTimeout(function() {
    res.status(200).json({voucherIndex:voucherIndex})
  }, 300);
})

app.get('/checkoutBasket', (req, res) => {
  const voucherCode = req.query.voucherCode
  const sessionToken = (req.body.sessionToken ? req.body.sessionToken : 1)
  const basket = baskets.find(e => e.sessionToken == sessionToken)
  let totalPrice=basket.products.reduce((previousValue, currentValue) => previousValue + (currentValue.product.price * currentValue.quantity),0)
    let arrayInError = []
    let arrayOfIndexToRemove = []
    for (let i = 0; i < basket.products.length; i++) {
      const product = basket.products[i];
      if(product.quantity > products.find(e => e.id == product.product.id).availableSizes.find(w => w.size == product.selectedSize).quantity){
        console.log("checking out more items than are available");
        arrayInError.push({name: product.product.name, size: product.selectedSize,quantity: product.quantity - products.find(e => e.id == product.product.id).availableSizes.find(w => w.size == product.selectedSize).quantity })
      } else {
        //remove size from available sizes array if quantity = 0
        const sizeIndex = products.find(e => e.id == product.product.id).availableSizes.findIndex(w => w.size == product.selectedSize)
        products.find(e => e.id == product.product.id).availableSizes[sizeIndex].quantity -= product.quantity
        if(products.find(e => e.id == product.product.id).availableSizes[sizeIndex].quantity == 0){
          products.find(e => e.id == product.product.id).availableSizes.splice(sizeIndex, 1)
        }
        arrayOfIndexToRemove.push(i)
      }
    }
    
    console.log("arrayOfIndexToRemove : ", arrayOfIndexToRemove);
    // console.log("before : ", );
    for (let i = arrayOfIndexToRemove.length-1; i > -1; i--) {
      const index = arrayOfIndexToRemove[i];
      console.log(index);
      baskets.find(e => e.sessionToken == (req.params["sessionstoken"] ? req.params["sessionstoken"] : 1)).products.splice(index,1)
    }
    if(voucherCode) {
      const nowEpoch = Date.now()
      console.log(vouchers.findIndex(e => e.sessionToken == sessionToken && e.voucherCode == voucherCode));
      const voucherIndex = vouchers.findIndex(e => e.sessionToken == sessionToken && e.voucherCode == voucherCode && nowEpoch < new Date(e.expiryDate).valueOf())
      // console.log("voucherIndex : ", voucherIndex);
      const priceReduction = totalPrice * vouchers[voucherIndex].priceReduction
      const limitedPriceReduction = priceReduction > vouchers[voucherIndex].limit ? vouchers[voucherIndex].limit : priceReduction
      totalPrice = totalPrice - limitedPriceReduction
    }
    setTimeout(function() {
      res.status(200).json({arrayInError: arrayInError, totalPrice: totalPrice})
    }, 300);
  })
  
  app.post('/updateProductInBasket', (req, res) => {
    let newQuantity = -1
    const basketIndex = baskets.findIndex(e => e.sessionToken == (req.body.sessionToken ? req.body.sessionToken : 1))
    console.log('updateProductInBasket req.body :', req.body );
    if(basketIndex > -1){
      //found basket
      const productIndex = baskets[basketIndex].products.findIndex(e => e.product.id == req.body.product.id && e.selectedSize == req.body.selectedSize)
      console.log('productIndex : ',productIndex);
      if(productIndex > -1){
        //if yes then change qty
        if(req.body.quantity == 0) {
          //remove item from basket
          baskets[basketIndex].products.splice(productIndex, 1);
        } else {
          baskets[basketIndex].products[productIndex].quantity=req.body.quantity
          newQuantity = baskets[basketIndex].products[productIndex].quantity
        }
      }
    } else {
      //basket doesn't exist, we don't update it and hope for the best :)
    }
    console.log('new qty : ', newQuantity);
    setTimeout(function() {
      res.status(200).json({newQuantity: newQuantity})
    }, 300);
  })
  
  app.get('/removeStock', (req,res) => {
      const productID = req.query.productID
      const quantity = req.query.quantity
      const size = req.query.size
      console.log("productID, quantity, size : ", productID, quantity, size);
      if(quantity > products.find(e => e.id == productID).availableSizes.find(w => w.size == size).quantity){
        console.log("removing more items than are available");
        // arrayInError.push({name: product.product.name, size: size,quantity: product.quantity - products.find(e => e.id == productID).availableSizes.find(w => w.size == size).quantity })
      } else {
        //remove size from available sizes array if quantity = 0
        const sizeIndex = products.find(e => e.id == productID).availableSizes.findIndex(w => w.size == size)
        products.find(e => e.id == productID).availableSizes[sizeIndex].quantity -= quantity
        if(products.find(e => e.id == productID).availableSizes[sizeIndex].quantity == 0){
          products.find(e => e.id == productID).availableSizes.splice(sizeIndex, 1)
        }
        // arrayOfIndexToRemove.push(i)
      }
      res.sendStatus(200)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  