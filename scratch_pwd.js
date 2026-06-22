import bcrypt from "bcryptjs";

const hash = "$2b$10$EUiZ/TCkalGMe/6DxSiHduj88H6AnkF9VeeniTfqpLnWJkkY1Oru.";
const passwordsToTest = ["admin", "password", "123456", "kahvalti", "konagi", "kahvaltikonagi"];

for (const pwd of passwordsToTest) {
  if (bcrypt.compareSync(pwd, hash)) {
    console.log(`Password found: ${pwd}`);
    process.exit(0);
  }
}
console.log("Password not found in common list.");
