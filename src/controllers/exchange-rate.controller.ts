import { Request, Response } from "express";
import * as currencyService from "../services/exchange-rate.service";

export const getExchangeRate = async (req: Request, res: Response) => {
  const currency = req.params.currency;
  if (!currency) {
    return res.status(400).json({ message: "Invalid currency" });
  }

  const data = await currencyService.getExchangeRate(currency);
  return res.json({ data });
};
