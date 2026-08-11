import { ProviderType } from "../types";
import { catalog, genres } from "./catalog";
import { getMeta } from "./meta";
import { getPosts, getSearchPosts } from "./posts";
import { getStream } from "./stream";

export const balbums: ProviderType = {
  catalog,
  genres,
  GetMetaData: getMeta,
  GetHomePosts: getPosts,
  GetSearchPosts: getSearchPosts,
  GetStream: getStream,
};
