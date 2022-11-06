import { handler } from "../utils/handler";
import { getPage } from "../repository/page";

export const main = handler(async (event) => {
  const slug = event.pathParameters!.slug;

  if (!slug) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  try {
    const page = await getPage(slug);

    if (!page) {
      throw new Error(`Page ${slug} does not exist`);
    }

    return page;
  } catch (err) {
    throw err;
  }
});
