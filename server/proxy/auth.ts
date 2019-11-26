import DB from "../db";
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

export default {
  existsAccount,
  newAccount,
  findAccount
};
