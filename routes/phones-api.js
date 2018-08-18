const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../configs/multer');


const Phone = require('../models/phone-model');
//import { Phone } from '../models/phone-model';

/* GET Phones listing. */
router.get('/phones', (req, res, next) => {
    Phone.find()
    .then((phonesList, err) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json(phonesList);
    })
    .catch(error => next(error))
  });

/* CREATE a new Phone. */
router.post('/', upload.single('file'), function(req, res) {
  console.log('req.file ', req.file);
  const phone = new Phone({
    name: req.body.name,
    brand: req.body.brand,
    image: `/uploads/${req.file.filename}`,
    specs: JSON.parse(req.body.specs) || []
  });

  phone.save((err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'New Phone created!',
      phone: phone
    });
  });
});
  
/* GET a single Phone. */
router.get('/phones/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Phone.findById(req.params.id)
    .then(thePhone => {
        res.json(thePhone);
    })
    .catch(error => next(error))
  });
  
  /* EDIT a Phone. */
  router.put('/phones/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    const updates = {
      brand: req.body.brand,
      name: req.body.name,
      specs: req.body.specs,
      image: req.body.image
    };
  
    Phone.findByIdAndUpdate(req.params.id, updates)
    .then(phone => {
      res.json({
        message: 'Phone updated successfully'
      });
    }) 
    .catch(error => next(error))     
  })
  
  /* DELETE a Phone. */
  router.delete('/phones/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Phone.remove({ _id: req.params.id })
    .then(message => {
      return res.json({
        message: 'Phone has been removed!'
      });
    })
    .catch(error => next(error))
  });

  module.exports = router;
