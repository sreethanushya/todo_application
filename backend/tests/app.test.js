const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe("To-Do API Tests", () => {

  let createdTaskId;

  test("POST /tasks - should create a task", async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: "Test Task",
        priority: "High",
        category: "Study"
      });

    expect(res.statusCode).toBe(200);
    createdTaskId = res.body._id;
  });

  test("GET /tasks - should return tasks", async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
  });

  test("PUT /tasks/:id - should update task", async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
  });

  test("DELETE /tasks/:id - should delete task", async () => {
    const res = await request(app)
      .delete(`/tasks/${createdTaskId}`);

    expect(res.statusCode).toBe(200);
  });

  // ✅ CLOSE DB CONNECTION (IMPORTANT)
  afterAll(async () => {
    await mongoose.connection.close();
  });

});