import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import ApiError from "../utils/ApiError";

type JsonData = {
  api: string;
  api2: string;
  name: string;
  payload: Record<string, any>;
};

class ResponseBuilder {
  message: string;
  data?: Record<string, any>;
  constructor(message: string, data?: Record<string, any>) {
    this.message = message;
    this.data = data;
  }
}

const readFileContents = async (path: string) => {
  try {
    const data = await readFile(path, "utf-8");
    return [null, JSON.parse(data)];
  } catch (err: any) {
    return [new Error("Error parsing file " + err.message), null];
  }
};
const fetchCurrencyRate = async (url: string, key: string) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return [null, result.data[key.toUpperCase()].value];
  } catch (err: any) {
    return [new Error("Error fetching currency rate " + err.message), null];
  }
};

export const getDatafromFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const filePath = path.join(__dirname, "../utils", "sampleData.json");
  const [err, fileData] = (await readFileContents(filePath)) as [
    Error | null,
    JsonData[] | null
  ];

  if (err) {
    // return res.status(500).json({ error: String(err) });
    return next(new ApiError(500, err.message));
  }

  if (!fileData || fileData.length === 0) {
    return res.status(200).json(new ResponseBuilder("No Data Found", []));
  }

  const promises = fileData.map((record) =>
    fetch(record.api, {
      body: JSON.stringify(record.payload),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  const settledResponses = await Promise.allSettled(promises);
  const finalResponse: Record<string, any>[] = [];

  for (let i = 0; i < settledResponses.length; i++) {
    const response = settledResponses[i];

    const currency =
      fileData[i].api2.split("=")[fileData[i].api2.split("=").length - 1];

    if (response.status === "fulfilled") {
      const [err, currencyData] = await fetchCurrencyRate(
        fileData[i].api2,
        currency
      );
      finalResponse.push({
        name: fileData[i].name,
        postData: { postData: await response.value.json() },
        currency: currencyData,
      });
    } else {
      const [err, currencyData] = await fetchCurrencyRate(
        fileData[i].api2,
        currency
      );
      finalResponse.push({
        name: fileData[i].name,
        postData: "some issue in API",
        currency: currencyData,
      });
    }
  }

  return res
    .status(200)
    .json(new ResponseBuilder("data fetched", finalResponse));
};
