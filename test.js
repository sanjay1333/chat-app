const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./app");
const User = require("./src/models/user.model.js");
const bcrypt = require("bcryptjs");

beforeAll(async () => {

  await mongoose.connect(
    "mongodb+srv://clean-super:A3A4ZXlv04QKIFED@cluster0.yapuopw.mongodb.net/cleanersApp",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
});

afterAll(async () => {
 
  await mongoose.connection.close();
});

describe("User Registration and Login API", () => {
  test("should register a new user", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      contactNumber: "1234567890",
      userName: "johndoe",
      password: "password123",
      email: "johndoe@example.com",
    };

    const response = await request(app)
      .post("/api/user/registerUser")
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Success");
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data).toHaveProperty("userName", "johndoe");
  });

  test("should not register a user with invalid data", async () => {
    const invalidUser = {
      firstName: "John",
      lastName: "Doe",
      contactNumber: "1234567890",
      userName: "",
      password: "password123",
      email: "johndoe@example.com",
    };

    const response = await request(app)
      .post("/api/user/registerUser")
      .send(invalidUser);

    expect(response.statusCode).toBe(422);
  });

  test("should log in an existing user", async () => {
    const existingUser = {
      userName: "johndoe",
      password: "password123",
    };

   
    const hashedPassword = await bcrypt.hash(existingUser.password, 10);

    const user = new User({
      firstName: "John",
      lastName: "Doe",
      contactNumber: "1234567890",
      userName: "johndoe",
      password: hashedPassword,
      email: "johndoe@example.com",
    });

    await user.save();

    const response = await request(app)
      .post("/api/user/userLogin") 
      .send(existingUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.body.userDetails).toHaveProperty("userName", "johndoe");
    expect(response.body).toHaveProperty("accessToken");
  });

  test("should not log in a user with incorrect password", async () => {
    const incorrectPasswordUser = {
      userName: "johndoe",
      password: "wrongpassword",
    };

    const response = await request(app)
      .post("/api/user/userLogin")
      .send(incorrectPasswordUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("UserName Or Password Incorrect");
  });
});
