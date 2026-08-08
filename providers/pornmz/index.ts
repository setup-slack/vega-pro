import { ProviderType } from "../types";
import { catalog, genres } from "./catalog";
import { getPosts, getSearchPosts } from "./posts";
import { getMeta } from "./meta";
import { getStream } from "./stream";

export const pornmz: ProviderType = {
  catalog,
  genres,
  GetHomePosts: getPosts,
  GetSearchPosts: getSearchPosts,
  GetMetaData: getMeta,
  GetStream: getStream,
};
