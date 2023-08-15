import { urlencoded } from "body-parser";
import { renderFile } from "ejs";
import { static as assets, default as express } from "express";
import { Dictionary as Dict, filter } from "lodash";
import morgan from "morgan";
import { resolve } from "path";
import { Event } from "./Event";
import { EventCategory } from "./EventCategory";

const port = 8080;

const name = "Event Management App";

const authors = {
  kevin: "31458149",
  tanishi: "32586949",
};

const data: { events: Event[]; categories: EventCategory[] } = {
  events: [],
  categories: [],
};

const relative = (path: string) => resolve(__dirname, path);

const render = (path: string, args: Dict<any> = {}) =>
  renderFile(path, { name, data, authors, ...args });

const app = express();

app.use(
  assets(relative("assets")),
  urlencoded({ extended: true }),
  morgan("dev")
);

// ─── Task Group 1 ────────────────────────────────────────────────────────────

{
  // ─── Add Category ──────────────────────────────────────────────────────────

  app.get(`/${authors.tanishi}/categories/add`, async (_, res) =>
    res.send(await render("pages/categories/add.html"))
  );

  app.post(`/${authors.tanishi}/categories/add`, (req, res) => {
    const { name, description, image } = req.body;
    data.categories.push(new EventCategory(name, description, image));
    res.redirect(`/${authors.tanishi}/categories`);
  });

  // ─── List Categories ───────────────────────────────────────────────────────

  app.get(`/${authors.tanishi}/categories`, async (req, res) => {
    const { keyword } = req.query;
    res.send(await render("pages/categories/index.html", { keyword }));
  });

  // ─── Event Details ─────────────────────────────────────────────────────────

  app.get(`/${authors.tanishi}/events/:id`, async (req, res) => {
    const { id } = req.params;
    res.send(await render("pages/events/details.html", { id }));
  });

  // ─── Delete Category ───────────────────────────────────────────────────────

  app.delete(`/${authors.tanishi}/categories/:id`, async (req, res) => {
    const { id } = req.params;
    data.categories = filter(data.categories, (c) => c.id !== id);
    res.redirect(`/${authors.tanishi}/categories`);
  });
}

// ─── Task Group 2 ────────────────────────────────────────────────────────────

{
  // ─── Add Event ─────────────────────────────────────────────────────────────

  app.get(`/${authors.kevin}/events/add`, async (_, res) =>
    res.send(await render("pages/events/add.html"))
  );

  app.post(`/${authors.kevin}/events/add`, (req) => {});

  // ─── List All Events ───────────────────────────────────────────────────────

  app.get(`/${authors.kevin}/events`, async (_, res) => {
    res.send(await render("pages/events/index.html"));
  });

  // ─── List Sold-out Events ──────────────────────────────────────────────────

  app.get(`/${authors.kevin}/events/sold-out`, async (_, res) => {
    res.send(await render("pages/events/index.html", { soldOutOnly: true }));
  });

  // ─── Category Details ──────────────────────────────────────────────────────

  app.get(`/${authors.kevin}/categories/:id`, async (req, res) => {
    const { id } = req.params;
    res.send(await render("pages/categories/details.html", { id }));
  });

  // ─── Delete Event ──────────────────────────────────────────────────────────

  app.delete(`/${authors.kevin}/events/:id`, async (req, res) => {});
}

// ─── Home ────────────────────────────────────────────────────────────────────

app.get("/", async (_, res) => {
  res.send(await render("pages/index.html"));
});

app.get("*", async (_, res) => {
  res.send(await render("pages/404.html"));
});

// ─── Start ─────────────────────────────────────────────────────────────────

// Start the server
app.listen(port);
