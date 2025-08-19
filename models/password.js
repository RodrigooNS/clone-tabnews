import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  const pepperedPassword = password + process.env.PEPPER;
  return await bcryptjs.hash(pepperedPassword, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 3;
}

async function compare(providedPassword, storedPassword) {
  const pepperedPassword = providedPassword + process.env.PEPPER;
  return await bcryptjs.compare(pepperedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
