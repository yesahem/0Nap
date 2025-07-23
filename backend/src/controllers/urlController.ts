import type { Request as ExpressRequest, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { parse, URL } from "url";
import { scheduleUrl, unscheduleUrl } from "../services/schedulerService";

interface AuthRequest extends ExpressRequest {
  user?: { id: string };
}

export const addUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { url, interval } = req.body;
    let parsedUrl;
    try {
      parsedUrl = URL.parse(url);
      if (!parsedUrl!.protocol || !parsedUrl?.host) {
        return res.status(400).json({ error: "Invalid URL" });
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL" });
    }
    // Get userId from authenticated request (assume req.user.id)
    console.log("req.user",req.user);
    console.log("req.user id",req.user?.id);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const newUrl = await prisma.urlPing.create({ data: { url, interval, userId } });
    
    // Immediately schedule the new URL for pinging
    await scheduleUrl(newUrl.id, newUrl.url, newUrl.interval);
    
    res.status(201).json(newUrl);
  } catch (err) {
    next(err);
  }
};

export const getUrls = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const urls = await prisma.urlPing.findMany();
    res.json(urls);
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "URL ID is required" });
    }
    
    // Unschedule the URL before deleting
    await unscheduleUrl(id);
    
    await prisma.urlPing.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 