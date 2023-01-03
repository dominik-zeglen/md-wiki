import { generatePath } from "react-router";
import urlJoin from "url-join";

function createRoute<T extends string | void = void>(
  path: string,
  prefix?: string
) {
  return {
    to: (args: T extends string ? Record<T, string> : void) =>
      generatePath(prefix ? urlJoin(prefix, path) : path, args ?? {}),
    path,
  };
}

export const siteRoutes = {
  home: createRoute("/"),
  page: createRoute<"slug">("/pages/:slug"),
  tag: createRoute<"id">("/tags/:id"),
  tags: createRoute("/tags/"),
};

export const panelRoutes = {
  home: createRoute("/", "/panel/"),
  pages: createRoute("pages/", "/panel/"),
  pageCreate: createRoute("pages/new", "/panel/"),
  page: createRoute<"slug">("pages/:slug/edit", "/panel/"),
  tags: createRoute("tags", "/panel/"),
  tag: createRoute<"id">("tags/:id", "/panel/"),
  users: createRoute("users", "/panel/"),
  user: createRoute<"name">("user/:name", "/panel/"),
  account: createRoute("account", "/panel/"),
  settings: createRoute("settings", "/panel/"),
};
