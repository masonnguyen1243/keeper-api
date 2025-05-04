// Lưu ý Brevo là tên thương hiệu mới của sib - Sendinblue
// Vì thế trong phần hướng dẫn trên github có thể nó vẫn còn giữ tên biến SibApiV3Sdk
// https://github.com/getbrevo/brevo-node
const SibApiV3Sdk = require("@getbrevo/brevo");
import { env } from "~/config/environment";

/**
 * Có thể xem thêm phần docs cấu hình theo từng ngôn ngữ khác nhau tùy dự án ở Brevo Dashboard > Account > SMTP & API > API Keys
 * https://brevo.com
 * Với Nodejs thì tốt nhất cứ lên github repo của bọn nó là nhanh nhất:
 * https://github.com/getbrevo/brevo-node
 */

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (recipientEmail, costomSubject, customHtmlContent) => {
  //Khởi tạo 1 cái sendSmtpMail với những thông tin cần thiết
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  //Tài khoản gửi mail (lưu ý: địa chỉ admin email phải là địa chỉ tạo tài khoản Brevo)
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  };

  //Những tài khoản nhận mail
  //'to' phải là 1 array để sau chúng ta có thể tùy biến gửi 1 mail đến nhiều user tùy tính năng của từng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }];

  //Tiêu đề của email
  sendSmtpEmail.subject = costomSubject;

  //Nội dung email dạng html
  sendSmtpEmail.htmlContent = customHtmlContent;

  //Gọi hành động gửi mail
  //sendTransacEmail sẽ return 1 Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail,
};
