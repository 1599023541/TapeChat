const cloud = require('wx-server-sdk')
cloud.init()
const tencentcloud = require("tencentcloud-sdk-nodejs");
const OcrClient = tencentcloud.ocr.v20181119.Client;
const models = tencentcloud.ocr.v20181119.Models;
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;
let cred = new Credential("******", "******");
let httpProfile = new HttpProfile();
httpProfile.endpoint = "ocr.tencentcloudapi.com";
let clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
let client = new OcrClient(cred, "ap-beijing", clientProfile);
let req = new models.GeneralBasicOCRRequest();

// 云函数入口函数
exports.main = async(event, context) => {
  const { base64 } = event;
  let params = `{"ImageBase64":"${base64}"}`;
  req.from_json_string(params);
  return new Promise((resolve, reject) => {
    client.GeneralBasicOCR(req, function (errMsg, response) {
      if (errMsg) {
        reject(errMsg);
        return;
      }
      resolve(response.to_json_string())
    });
  });
}