
import nodemailer from "nodemailer"
require('dotenv').config();


let sendMailResetPasswordToken = async(dataSend) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_APP_NAME,
        pass: 'mtykbrzrkldcawwi'
      }
    });
   
      const info = await transporter.sendMail({
        from: `"Lix EIW 👻" <${process.env.EMAIL_APP_NAME}>`, // sender address
        to: `${dataSend.email}`, // list of receivers
        subject: "ResetPassWord", // Subject line
        text: `Xin Chào ,${dataSend.fullname} `, // plain text body
        html: bulidMail(dataSend.token,'reset-password'), // html body
      });
      return info;
}

let sendEmailAccuracyEmailRegister =async(dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP_NAME,
      pass: 'mtykbrzrkldcawwi'
    }
  });
 
    const info = await transporter.sendMail({
      from: `"Lix EIW 👻" <${process.env.EMAIL_APP_NAME}>`, // sender address
      to: `${dataSend.email}`, // list of receivers
      subject: "Vertify register email token check", // Subject line
      text: `Xin Chào ,${dataSend.fullname} `, // plain text body
      html: bulidMail(dataSend.token,'accuracy-register'), // html body
    });
    return info;
}



let bulidMail =(token,type) => {
    let name ='';
    if(type === 'reset-password') {
        name =`<a href="${process.env.REACT_FRONTEND_SERVER}/vertiy_token_change_password/${token}">Vui lòng nhấn vào link này để reset password. Link này sẽ hết hạn tròng vòng 15'</a>`
    }
    if(type === 'accuracy-register') {
      name =`<a href="${process.env.URL_SERVER}/api/user/accuracy_vetify_register/${token}">Vui lòng nhấn vào link này vertify account . Link này sẽ hết hạn tròng vòng 15'</a>`
    }
    return name;
}
module.exports ={
    sendMailResetPasswordToken,sendEmailAccuracyEmailRegister
}


  

