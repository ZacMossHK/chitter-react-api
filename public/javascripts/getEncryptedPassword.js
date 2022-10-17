import * as bcrypt from "bcrypt";

export default getEncryptedPassword = async (password) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};
