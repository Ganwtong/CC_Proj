const { check } = require('express-validator');
const db = require('../models');
const bcrypt = require('bcrypt');

const createAccount = [
    check('email').
      trim().
      not().
      isEmpty().
      isEmail().
      custom(async (value) => {
        let account = await db.account.findOne({ where: { email: value } })
        if (account) {
          throw new Error('Email Exist');
        }
      }),
    check('password').
      trim().
      not().
      isEmpty().
      isLength({ min: 6 }).
      withMessage('Password must be at least 6 characters long'),
    
  ]

const new_customer = [
  check('customer_contact').
    trim().
    not().
    isEmpty().
    custom(async (value) => {
      let account = await db.customer.findOne({ where: { customer_contact: value } })
      if (account) {
        throw new Error('Customer Exist');
      }
    }),
  check('customer_email').
    trim().
    not().
    isEmpty().
    isEmail().
    custom(async (value) => {
      let account = await db.customer.findOne({ where: { customer_email: value } })
      if (account) {
        throw new Error('Email Exist');
      }
    }),
]

const changePassword = [
  check('email').
      trim().
      not().
      isEmpty().
      isEmail().
      custom(async (value) => {
        let account = await db.account.findOne({ where: { email: value } })
        if (!account) {
          throw new Error('Email Does Not Exist');
        }
      }),
  check('oldpassword').
    custom(async (value, { req }) => {
      let account = await db.account.findByPk(req.body.account_id)
      if (!await bcrypt.compare(value, account.password)) {
        throw new Error('Invalid Old Password');
      }
    }),
  check('newpassword').
    trim().
    not().
    isEmpty().
    isLength({ min: 6}).
    withMessage('Password must be at least 6 characters long'),
]


const new_item = [
  check('item_name')
    .trim()
    .not()
    .isEmpty()
    .custom(async (value) => {
      let itemName = value.toLowerCase(); // Convert item_name to lowercase
      let item = await db.item.findOne({ where: { item_name: itemName } });
      if (item) {
        throw new Error('Item Exist');
      }
    }),
];


const validators = {
  createAccount,
  new_customer,
  new_item,
  changePassword,
};

module.exports = validators;
