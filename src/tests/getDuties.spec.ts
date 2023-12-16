import request from "supertest";
import { app } from "../index";
import { Pool } from "pg";

jest.mock("pg", () => {
  const mockPool = {
    connect: jest.fn(),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe("Get duties", () => {
  let pool: Pool;
  beforeEach(() => {
    pool = new Pool();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of duties", async () => {
    const mockData = {
      rows: [
        {
          created_at: "2023-12-14T22:19:09.270Z",
          id: 1,
          name: "test2",
          updated_at: "2023-12-15T02:31:00.146Z",
        },
        {
          created_at: "2023-12-14T22:19:09.270Z",
          id: 2,
          name: "test2",
          updated_at: "2023-12-15T02:31:00.146Z",
        },
      ],
      rowCount: 2,
    };
    //@ts-ignore
    pool.query.mockResolvedValueOnce(mockData);
    const res = await request(app).get("/api/duties").expect(200);
    expect(res.body).toEqual(mockData.rows);
  });

  it("should return 500", async () => {
    //@ts-ignore
    pool.query.mockImplementation(() => {
      throw new Error("");
    });
    const res = await request(app).get("/api/duties").expect(500);
    expect(res.body.error.message).toEqual("Internal Server Error");
  });
});
