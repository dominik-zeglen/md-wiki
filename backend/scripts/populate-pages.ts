import { faker } from "@faker-js/faker";
import { createPage } from "../src/repository/page";

for (let index = 0; index < 100; index++) {
  const title = faker.random.words(3);
  const slug = faker.helpers.slugify(title);
  createPage({
    data: {
      title,
      slug,
      content: faker.random.words(100),
    },
    user: "admin",
  });
}
