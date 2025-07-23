import cron from "node-cron";
import prisma from "../prisma/client";

const activeTasks: Record<string, ReturnType<typeof cron.schedule>> = {};

async function pingUrl(url: string, urlId: string) {
  try {
    const response = await fetch(url);
    console.log(`✅ Pinged ${url} - Status: ${response.status}`);
    
    // Increment ping counter
    await prisma.urlPing.update({
      where: { id: urlId },
      data: { pingCount: { increment: 1 } }
    });
  } catch (err) {
    console.error(`❌ Failed to ping ${url}:`, err);
  }
}

export async function scheduleAll() {
  const urls = await prisma.urlPing.findMany();
  urls.forEach(({ id, url, interval }) => {
    if (activeTasks[id]) return;
    const task = cron.schedule(`*/${interval} * * * *`, () => pingUrl(url, id));
    activeTasks[id] = task;
    console.log(`📅 Scheduled ${url} to ping every ${interval} minutes`);
  });
}

export async function scheduleUrl(urlId: string, url: string, interval: number) {
  // Don't schedule if already active
  if (activeTasks[urlId]) return;
  
  const task = cron.schedule(`*/${interval} * * * *`, () => pingUrl(url, urlId));
  activeTasks[urlId] = task;
  console.log(`📅 Scheduled ${url} to ping every ${interval} minutes`);
}

export async function unscheduleUrl(urlId: string) {
  if (activeTasks[urlId]) {
    activeTasks[urlId].stop();
    delete activeTasks[urlId];
    console.log(`🛑 Unscheduled URL with ID: ${urlId}`);
  }
}

export function stopAll() {
  Object.values(activeTasks).forEach((task) => task.stop());
} 