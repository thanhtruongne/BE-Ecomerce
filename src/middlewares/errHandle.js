//hàm ẩn lỗi
const notfound = (req,res,next) => {
    const error =  new Error(`Route ${req.originalUrl} not found`);
    res.status(404);
    next(error);
}

const errHandler = (error, req,res,next) => {
  const statusCode = res.statusCode === 200 ? 500: res.statusCode;
  return res.status(statusCode).json({
    errCode : -3,
    message :error ?.message
  })
}

module.exports = {
    errHandler,notfound
}