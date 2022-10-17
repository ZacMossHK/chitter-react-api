import * as bcrypt from "bcrypt";

export default compareEncryptedPasswords = async (
  password,
  encryptedPassword
) => {
  const result = await bcrypt.compare(password, encryptedPassword);
  return result;
};
