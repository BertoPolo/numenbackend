// import supertest from "supertest"
// import express from "express"
// import usersRouter from "../src/api/user/users.routes"

// // is there extra comments just for learning purposes

// // Simulates usersSchema and any other dependency which is necessary
// jest.mock("../../models/user", () => ({
//   checkCredentials: jest.fn(),
// }))

// const app = express()
// app.use(express.json()) // Middleware para parsear el body
// app.use("/users", usersRouter)

// describe("POST /login", () => {
//   it("should return 201 and the access token when credentials are correct", async () => {
//     // Configurar la simulación para devolver un usuario específico cuando las credenciales son correctas
//     require("../../models/user").checkCredentials.mockResolvedValueOnce({ _id: "user123", email: "test@example.com" })

//     const response = await supertest(app).post("/users/login").send({ email: "test@example.com", password: "correctPassword" })

//     expect(response.status).toBe(201)
//     expect(response.body).toHaveProperty("accessToken")
//     expect(response.body.email).toBe("test@example.com")
//   })

//   // Puedes añadir más tests aquí para cubrir otros casos, como credenciales incorrectas
// })
