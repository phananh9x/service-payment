var mongoose = require('mongoose'),
	config = require('../config'),
  	jwt = require('jsonwebtoken'),
  	bcrypt = require('bcrypt'),
  	User = mongoose.model('User');

exports.register = function(req, res) {
    console.log(req)
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err)
      return res.status(500).send({
        success: false,
        results: null,
        message: err
      });
    console.log(user)
    return res.send({success: true, results: user});
  });
};

exports.get = function(req, res) {
    User.find({ _id : req.user.user._id }, function(err, data) {
      if (err) 
        return res.status(400).send({
          success: false, 
          results: null,
          message: err
        });
      return res.send({success: true, results: data});
    });
};

exports.sign_in = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err)
      return res.status(500).send({
        success: false,
        results: null,
        message: err
      });
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(500).send({
        success: false,
        results: null,
        message: 'Authentication failed. Invalid user or password.'
      });
    }
    return res.send({success: true, results: {
      token: jwt.sign({ user },
      config.secret) ,
      fullName:user.fullName,
      _id: user._id,
      email: user.email,
			phone: user.phone,
			address: user.address,
			gender: user.gender,
			birthday: user.birthday,
      image: user.image}});
  });
};

exports.update = function(req, res) {
  User.findOneAndUpdate({ email: req.body.email, pin : req.body.pin  }, req.body, {new: true}, function (err, data) {
    if (err)
      return res.status(400).send({
        success: false,
        results: null,
        message: err
      });
    return res.send({success: true, results: data});
  });
};


exports.delete = function(req, res) {
  User.findByIdAndRemove({_id : req.params.userId}, function (err, data) {
    if (err)
      return res.status(400).send({
        success: false,
        results: null,
        message: err
      });
    return res.send({success: true, results: data});
  });
};



exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(500).send({
      success: false,
      results: null,
      message: 'Unauthorized user!'
    });
  }
};

exports.verify = function(req, res, next) {
 User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err)
      return res.status(500).send({
        success: false,
        results: null,
        message: err
      });
    if (!user || user.pin != req.body.pin) {
      return res.status(500).send({
        success: false,
        results: null,
        message: 'Authentication failed. Invalid user or pin.'
      });
    }
    return res.send({success: true, results: user});
  });
};

exports.payment = function(req, res, next) {
 User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err)
      return res.status(500).send({
        success: false,
        results: null,
        message: err
      });
    if (!user || user.pin != req.body.pin) {
      return res.status(500).send({
        success: false,
        results: null,
        message: 'Authentication failed. Invalid user or pin.'
      });
    }
    if (user.so_tien > req.body.payment && user.so_tien - req.body.payment >= 50000) {
      user.so_tien  = user.so_tien - req.body.payment;
      user.save(function(err) {
        if(!err) {
            return res.send({
              success: true,
              results: 'Thanh toán thành công! số dư còn lại của bạn là: ' + user.so_tien
            });
        }
        else {
        }
      });
    }else {
      return res.status(500).send({
        success: false,
        results: null,
        message: 'Số dư không đủ để thanh toán!'
      });
    }

  });
};
