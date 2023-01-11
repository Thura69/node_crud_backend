const express = require('express');
require('./db/config');
const app = express();
const cros = require('cors');
const User = require('./db/Users');
const Product = require('./db/Products');

app.use(express.json());
app.use(cros());

app.post('/register',async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    

    res.send(result);
})

app.post('/login', async (req, res) => {
    if (req.body.password && req.body.email) {
        const user =await User.findOne(req.body).select("-password");

    if (user) {
       res.send(user)
    } else {
        res.send("no user found")
   }
    } else {
        res.send("Please Type Carefully")
   }
})

app.post('/add-new',async (req, res) => {
    let products = new Product(req.body);
    let result = await products.save();

    res.send(result);
})

app.get('/products', async (req, res) => {
    let result = await Product.find();

    if (result.length > 0) {
        res.send(result)
    } else {
        res.send(false)
    }
})

app.delete('/products/:id', async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
})

app.get('/products/:id', async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });

    if (result) {
        res.send(result)
    } else {
        res.send(false)
    }
})

app.put('/products/:id', async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id }, {
            $set:req.body
        }
    )
    res.send(result);
})

app.get('/search/:key', async (req, res) => {
    let result = await Product.find({
        $or:[{category:{$regex:req.params.key}}]
    })
    
    
        res.send(result);
   
})

app.listen(7000, () => {
    console.log("working")
})