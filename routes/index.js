var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Blog = require('../models/blog');
var primecustomer = require('../models/primecustomer');
var Freebook = require('../models/freebook');
var Paidbook = require('../models/paidbook');
const { result } = require('lodash');
const crypto = require('crypto');
var Razorpay = require('razorpay');

//to render homepage
router.get('/homepage',function(req,res,next){
	return res.render('home.ejs');
});

//to render register page
router.get('/register', function (req, res, next) {
	return res.render('index.ejs');
});

// submiting register form using POST method
router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;

	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

//final pay
router.post('/finalpay',function(req,res,next){
	console.log(req.body);
	var paymentinfo = req.body;

	if(!paymentinfo.email || !paymentinfo.city || !paymentinfo.state || !paymentinfo.pincode){
		res.send();
	} else {
		if (true) {

			primecustomer.findOne({email:paymentinfo.email},function(err,data){
				if(!data){
					var c;
					primecustomer.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new primecustomer({
							unique_id:c,
							email:paymentinfo.email,
							city: paymentinfo.city,
							state: paymentinfo.state,
							pincode: paymentinfo.pincode,
						});

						newPerson.save(function(err, Person){
							if(err){
								console.log(err);
								// return res.redirect('/profile');
							}	
							else{
								console.log('Success');
								// res.redirect('/profile');
							}	
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"successfully done"});
					// res.render('/profile');
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}
	}
})


router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/homepage');
		}else{
			// return res.render('data.ejs', {"name":data.username,"email":data.email});
			Paidbook.find().sort({ createdAt: -1 })
    		.then(result => {
     		 res.render('data.ejs', { paidbook: result });
    		})
    		.catch(err => {
     		 console.log(err);
    	});
		}
	});
});

router.get('/getfreebook',function(req,res,next){
	return res.render('freebookdisplay.ejs');
})

router.get('/getpaidbook',function(req,res,next){
	// return res.render('freebookdisplay.ejs');
	primecustomer.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/payment');
			console.log("to payment");
		}else{
			//console.log("found");
			// return res.render('data.ejs', {"name":data.username,"email":data.email});
			console.log("read paid book")
			return res.render('freebookdisplay.ejs');
		}
	});
})

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/homepage');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

router.get('/payment',function(req,res,next){
	return res.render('payment.ejs');
});

router.get('/Blogs',function(req,res,next){
	Blog.find().sort({ createdAt: -1 })
    .then(result => {
      return res.render('allblogs', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// to read paticular blog
router.get('/details/:id',function(req,res,next){
	const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      return res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Blog not found' });
    });
})

//create a blog get method to display
// router.get('/createblog',function(req,res,next){
	
// 	return res.render('createblog', { title: 'Create a new blog' });
// })

router.get('/createblog',function(req,res,next){
	primecustomer.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/payment');
			console.log("to payment");
		}else{
			//console.log("found");
			// return res.render('data.ejs', {"name":data.username,"email":data.email});
			console.log("Write blog")
			return res.render('createblog', { title: 'Create a new blog' });
		}
	});
	
})

//submitting the blog
router.post('/Blogs',function(req,res,next){
	const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      return res.redirect('/Blogs');
    })
    .catch(err => {
      console.log(err);
    });
})


router.get('/finalpay',function(req,res,next){
	return res.render('final_pay_form');
});


//all payment codes:
// app.use(express.static('./public'));

const instance = new Razorpay({ 
	key_id: '<enter key_id from razorpay>', 
	key_secret: '<enter secret_key from razorpay>'  
});

router.get('/payamount', (req, res) => {
  // res.send('working :D!');
  return res.render('payment_page');
})

router.post('/create/order', (req, res) => {
  const options = {
    amount: 19900,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
	console.log("order created");
    res.status(200).json(order);
  });
})

router.post("/verify", (req, res) => {
  let body =
    req.body.razorpay_order_id +
    "|" +
    req.body.razorpay_payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.razorpay_signature){
    response = { signatureIsValid: "true" };
    res.sendFile('./views/success_pay.html');
	console.log("Payment Success!")
  }
  res.status(200).json(response);
});


module.exports = router;
