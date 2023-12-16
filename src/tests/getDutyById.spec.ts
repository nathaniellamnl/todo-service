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

describe("Get duty by id", () => {
  let pool: Pool;
  beforeEach(() => {
    pool = new Pool();
    pool.query = jest.fn();
  });

  it("should return data with the id 1", async () => {
    const mockData = {
      rows: [
        {
          created_at: "2023-12-14T22:19:09.270Z",
          id: 1,
          name: "test2",
          updated_at: "2023-12-15T02:31:00.146Z",
        },
      ],
      rowCount: 1,
    };

    pool.query = jest.fn(
      () =>
        new Promise<QueryArrayResult<any>>((resolve, _) => {
          resolve({ ...mockData, command: "", oid: 0, fields: [] });
        })
    );
    const res = await request(app).get("/api/duties/2").expect(200);
    expect(res.body).toEqual(mockData.rows[0]);
  });

  it("should return 404 when database returns empty results ", async () => {
    const mockData = {
      rows: [],
      rowCount: 0,
    };
    pool.query = jest.fn(
      () =>
        new Promise<QueryArrayResult<any>>((resolve, _) => {
          resolve({ ...mockData, command: "", oid: 0, fields: [] });
        })
    );
    const res = await request(app).get("/api/duties/2").expect(404);
    expect(res.body.error.message).toEqual("Not Found");
  });

  it("should return 404 when the queried id is not valid ", async () => {
    const mockData = {
      rows: [
        {
          created_at: "2023-12-14T22:19:09.270Z",
          id: 1,
          name: "test2",
          updated_at: "2023-12-15T02:31:00.146Z",
        },
      ],
      rowCount: 0,
    };
    pool.query = jest.fn(
      () =>
        new Promise<QueryArrayResult<any>>((resolve, _) => {
          resolve({ ...mockData, command: "", oid: 0, fields: [] });
        })
    );
    const res = await request(app).get("/api/duties/jfhjd").expect(404);
    expect(res.body.error.message).toEqual("Not Found");
  });

  it("should return 500", async () => {
    pool.query = jest.fn(() => {
      throw new Error("");
    });
    const res = await request(app).get("/api/duties/1").expect(500);
    expect(res.body.error.message).toEqual("Internal Server Error");
  });
});
