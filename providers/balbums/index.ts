import { ProviderType } from "../types";
import { catalog, genres } from "./catalog";
import { getMetaData } from "./meta";
import { getPosts, getSearchPosts } from "./posts";
import { getStream } from "./stream";

export const balbums: ProviderType = {
  catalog,
  genres,
  GetMetaData: getMetaData,
  GetHomePosts: getPosts,
  GetSearchPosts: getSearchPosts,
  GetStream: getStream,
};
