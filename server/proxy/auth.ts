import DB from "../db";
import { IResp } from "../types";

const { Auth } = DB.Models;

async function existsAccount() {
  const exists = await Auth.exists({});
  return {
    exists
  };
}

async function newAccount(params) {
  const { exists } = await existsAccount();
  if (exists) {
    throw new Error("异常操作！");
  }
  const now = new Date();
  const entity = new Auth({
    password: params.password,
    createTime: now,
    modifyTime: now
  });
  const account = await entity.save();
  return {
    account
  };
}

async function findAccount(params) {
  const account = await Auth.findOne({
    password: params.password
  });
  return {
    account
  };
}

async function changePassword(params) {
  try {
    const old = await Auth.findOne({
      password: params.old
    });
    if (!old) {
      return <IResp>{
        code: -1,
        message: "原密码不正确！"
      };
    }
    await Auth.findOneAndUpdate(
      {},
      {
        password: params.password
      }
    );
    return <IResp>{
      code: 1
    };
  } catch (err) {
    console.error("修改密码出现异常：", err);
    return <IResp>{
      code: -1,
      message: "操作失败"
    };
  }
}

export default {
  existsAccount,
  newAccount,
  findAccount,
  changePassword
};
