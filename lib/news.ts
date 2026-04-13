import fs from "fs/promises";
import path from "path";

export type NewsItem = {
  id: string;
  title: string;
  text: string;
  image?: string;
  createdAt: string;
  author: string;
};

const filePath = path.join(process.cwd(), "data", "news.json");

async function readNews(): Promise<NewsItem[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    if (!data || data.trim().length === 0) {
      return [];
    }

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (err) {
    // 👇 WICHTIG: niemals crashen
    return [];
  }
}

async function writeNews(news: NewsItem[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(news, null, 2));
  } catch (err) {
    console.error("WRITE NEWS ERROR:", err);
  }
}

export async function getNews() {
  const news = await readNews();

  return news.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createNews(item: Omit<NewsItem, "id" | "createdAt">) {
  const news = await readNews();

  const newItem: NewsItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...item,
  };

  news.push(newItem);
  await writeNews(news);

  return newItem;
}
