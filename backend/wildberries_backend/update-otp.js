const { AppDataSource } = require("./src/data-source");
const { User } = require("./src/entities/user");

async function updateOTP() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email: "admin@example.com" });
  if (user) {
    user.otp = "123456";
    await userRepo.save(user);
    console.log("OTP updated");
  } else {
    console.log("User not found");
  }
  await AppDataSource.destroy();
}

updateOTP().catch(console.error);
