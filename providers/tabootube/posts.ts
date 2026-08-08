import { Post, ProviderContext } from "../types";

export const getPosts = async function ({
  filter,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  
  let url = "https://www.tabootube.xxx";
  if (filter) {
    url += filter;
  }
  
  // Handle pagination for KVS script based sites
  if (page > 1) {
    if (filter) {
      url = `${url}${page}/`;
    } else {
      url = `https://www.tabootube.xxx/latest-updates/${page}/`;
    }
  }

  const posts: Post[] = [];

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
      signal,
    });
    
    const $ = cheerio.load(res.data);
    
    $('.item a, .video a, div[class*="video"] > a, .list-videos .item > a').each((i, el) => {
      const title = $(el).attr('title') || $(el).find('strong.title').text().trim() || $(el).find('.title').text().trim();
      let href = $(el).attr('href');
      let image = $(el).find('img.thumb').attr('data-webp') || $(el).find('img.thumb').attr('src') || $(el).find('img').attr('data-webp') || $(el).find('img').attr('src');
      
      if (href && !href.startsWith('http')) {
        href = `https://www.tabootube.xxx${href}`;
      }
      if (image && !image.startsWith('http')) {
        image = `https://www.tabootube.xxx${image}`;
      }
      
      if (title && href && image && href.includes('/video/')) {
         posts.push({
           title,
           link: href,
           image,
           provider: 'tabootube'
         });
      }
    });

  } catch (err) {
    console.error("tabootube getPosts error:", err);
  }

  return posts;
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  
  let url = `https://www.tabootube.xxx/search/${encodeURIComponent(searchQuery)}/`;
  if (page > 1) {
    url += `${page}/`;
  }

  const posts: Post[] = [];

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
      signal,
    });
    
    const $ = cheerio.load(res.data);
    
    $('.item a, .video a, div[class*="video"] > a, .list-videos .item > a').each((i, el) => {
      const title = $(el).attr('title') || $(el).find('strong.title').text().trim() || $(el).find('.title').text().trim();
      let href = $(el).attr('href');
      let image = $(el).find('img.thumb').attr('data-webp') || $(el).find('img.thumb').attr('src') || $(el).find('img').attr('data-webp') || $(el).find('img').attr('src');
      
      if (href && !href.startsWith('http')) {
        href = `https://www.tabootube.xxx${href}`;
      }
      if (image && !image.startsWith('http')) {
        image = `https://www.tabootube.xxx${image}`;
      }
      
      if (title && href && image && href.includes('/video/')) {
         posts.push({
           title,
           link: href,
           image,
           provider: 'tabootube'
         });
      }
    });

  } catch (err) {
    console.error("tabootube getSearchPosts error:", err);
  }

  return posts;
};
