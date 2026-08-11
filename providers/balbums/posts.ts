import { Post, ProviderContext } from "../types";

export const getPosts = async (
  filter: string,
  page: number,
  providerValue: string,
  signal: AbortSignal,
  providerContext: ProviderContext
): Promise<Post[]> => {
  const { axios, cheerio } = providerContext;
  let url = `https://balbums.st${filter}&page=${page}`;
  
  if (filter === "") {
      // Default latest albums
      url = `https://balbums.st/?sort=latest&page=${page}`;
  }

  const { data } = await axios.get(url, { signal });
  const $ = cheerio.load(data);

  const posts: Post[] = [];

  $("a.card").each((_, el) => {
    const link = $(el).attr("href");
    const title = $(el).find("h3").text().trim();
    const image = $(el).find("img.thumb-img").attr("src");

    if (title && link) {
      posts.push({
        title,
        link,
        image: image || "",
        provider: providerValue,
      });
    }
  });

  return posts;
};

export const getSearchPosts = async (
  searchQuery: string,
  page: number,
  providerValue: string,
  signal: AbortSignal,
  providerContext: ProviderContext
): Promise<Post[]> => {
  return getPosts(
    `/?search=${encodeURIComponent(searchQuery)}&mode=broad`,
    page,
    providerValue,
    signal,
    providerContext
  );
};
