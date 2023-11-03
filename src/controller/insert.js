import Product from '../models/products';
import asyncHandler from 'express-async-handler';
import cate from '../DATA/cate'
import data from '../DATA/data.json'
import User from '../models/users'
import categories from '../models/categories';
import slugify from 'slugify';

const ExportData = async(product) => {
      await Product.create({
        title : product?.name,
        slug : slugify(product?.name),
        description : product?.desc,
        thumb : product?.thumb,
        brand : product?.brand,
        sold : Math.round(Math.random() * 200),
        price : Number(product?.price.match(/\d/g).join('')/100), 
        category : product?.category[1],
        color :product?.variants?.find(el => el.label === 'Color')?.variants[0],
        qualnity : Math.round(Math.random() * 100),
        images : product?.images,
        internal : product?.variants?.find(el => el.label === 'Internal')?.variants[0],
      })
}
const ExportCategory =async (cate) => {
      await categories.create({
        title : cate.cate,
        brand : cate.brand
})
}

let insertDataProduct = asyncHandler(async (req,res) => {
     const dataPromise = [];
     for(let item of data) dataPromise.push(ExportData(item));
     await Promise.all(dataPromise);
     return res.status(200).json({
        status : dataPromise ? 'Done' : 'Fail'
     })


})

let insertDataCate =asyncHandler(async(req,res) => {
  const dataPromise = [];
  for(let item of cate) dataPromise.push(ExportCategory(item));
  await Promise.all(dataPromise);
  return res.status(200).json({
     status : dataPromise ? 'Done' : 'Fail'
  })
})

const custom = [
  {
    firstName : 'Thanh Trường',
    lastName : 'Nguyễn',
    email : 'nthanhtruong883@gmail.com',
    role : 'admin',
    password : '2630612',
    mobile : '012132773131'
  },
  {
    firstName : 'Thanh Khôi',
    lastName : 'Nguyễn',
    email : 'truonntp28535@fpt.edu.vn',
    password : '123',
    mobile : '0123221777431'
  },
  {
    firstName : 'Thanh Trung',
    lastName : 'Nguyễn',
    email : 'nthasadasd2122@gmail.com',
    password : '123',
    mobile : '0123999131'
  },
  {
    firstName : 'Bích Ngân',
    lastName : 'Nguyễn Thị',
    email : 'bichngan22@gmail.com',
    password : '123',
    mobile : '012313229991'
  },
  {
    firstName : 'Tấn Phát',
    lastName : 'Nguyễn',
    email : 'tanphatd32@gmail.com',
    password : '1232',
    mobile : '01231329552111'
  },
  {
    firstName : 'Gia Hưng',
    lastName : 'Nhâm',
    email : 'giahung221@gmail.com',
    password : '13323',
    mobile : '01223121331'
  },
  {
    firstName : 'Minh Trí',
    lastName : 'Nguyễn',
    email : 'minhtri221@gmail.com',
    password : '12333',
    mobile : '0123155122522111'
  },
]

const fectDataUser = async(data) => {
    await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role : data?.role,
      password: data.password,
      mobile: data.mobile
    })
}

let insertDataUSER = asyncHandler(async(req,res) => {
  const template = [];
  for(let i of custom) template.push(fectDataUser(i));
  await Promise.all(template);
  return res.status(200).json({
    stats : template ? true : false
  })
})

module.exports = {
    insertDataProduct,insertDataCate,insertDataUSER
}
