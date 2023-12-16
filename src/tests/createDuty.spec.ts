import request from "supertest";
import { app } from "../index";
import { Pool, QueryArrayResult } from "pg";

jest.mock("pg", () => {
  const mockPool = {
    connect: jest.fn(),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe("Create duty", () => {
  let pool: Pool;
  const mockData = {
    rows: [
      {
        created_at: "2023-12-14T22:19:09.270Z",
        id: 1,
        name: "test1",
        updated_at: "2023-12-15T02:31:00.146Z",
      },
    ],
    rowCount: 1,
  };
  beforeEach(() => {
    pool = new Pool();
  });

  it("should return 400 when name is missing", async () => {
    const res = await request(app).post("/api/duties").expect(400);
    expect(res.body.error.message).toEqual("Name is required");
  });

  it("should return 201 when request body is valid", async () => {
    pool.query = jest.fn(
      () =>
        new Promise<QueryArrayResult<any>>((resolve, _) => {
          resolve({ ...mockData, command: "", oid: 0, fields: [] });
        })
    );
    const res = await request(app)
      .post("/api/duties")
      .send({ name: mockData.rows[0].name })
      .expect(201);
    expect(res.body.name).toEqual(mockData.rows[0].name);
  });

  it("should return 500 when database throws an error", async () => {
    pool.query = jest.fn(() => {
      throw new Error("");
    });
    const res = await request(app)
      .post("/api/duties")
      .send({ name: mockData.rows[0].name })
      .expect(500);
    expect(res.body.error.message).toEqual("Internal Server Error");
  });
});
