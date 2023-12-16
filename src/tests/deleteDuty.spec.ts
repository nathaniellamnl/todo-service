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

describe("Delete duty", () => {
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

  it("should return 404 when the queried id is not valid ", async () => {
    pool.query = jest.fn(
      () =>
        new Promise<QueryArrayResult<any>>((resolve, _) => {
          resolve({ ...mockData, command: "", oid: 0, fields: [] });
        })
    );
    const res = await request(app).delete("/api/duties/jfhjd").expect(404);
    expect(res.body.error.message).toEqual("Not Found");
  });

  it("should return 404 when the database returns empty results ", async () => {
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
    const res = await request(app).delete("/api/duties/1").expect(404);
    expect(res.body.error.message).toEqual("Not Found");
  });

  it("should return 200 when the data is valid", async () => {
    pool.query = jest.fn(
      () =>
        new Promise<QueryArrayResult<any>>((resolve, _) => {
          resolve({ ...mockData, command: "", oid: 0, fields: [] });
        })
    );
    await request(app).delete("/api/duties/1").expect(200);
  });

  it("should return 500 when database throws an error", async () => {
    pool.query = jest.fn(() => {
      throw new Error("");
    });
    const res = await request(app).delete("/api/duties/1").expect(500);
    expect(res.body.error.message).toEqual("Internal Server Error");
  });
});
