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
  a: { id: "31458149", name: "kevin" },
  b: { id: "32586949", name: "tanishi" },
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

  app.get(`/${authors.b.id}/categories/add`, async (_, res) =>
    res.send(await render("pages/categories/add.html"))
  );

  app.post(`/${authors.b.id}/categories/add`, (req, res) => {
    const { name, description, image } = req.body;
    data.categories.push(new EventCategory(name, description, image));
    res.redirect(`/${authors.b.id}/categories`);
  });

  // ─── List Categories ───────────────────────────────────────────────────────

  app.get(`/${authors.b.id}/categories`, async (req, res) => {
    const { keyword } = req.query;
    res.send(await render("pages/categories/index.html", { keyword }));
  });

  // ─── Event Details ─────────────────────────────────────────────────────────

  app.get(`/${authors.b.id}/events/:id`, async (req, res) => {
    const { id } = req.params;
    res.send(await render("pages/events/details.html", { id }));
  });

  // ─── Delete Category ───────────────────────────────────────────────────────

  app.delete(`/${authors.b.id}/categories/:id`, async (req, res) => {
    const { id } = req.params;
    data.categories = filter(data.categories, (c) => c.id !== id);
    res.redirect(`/${authors.b.id}/categories`);
  });
}

// ─── Task Group 2 ────────────────────────────────────────────────────────────

{
  // ─── Add Event ─────────────────────────────────────────────────────────────

  app.get(`/${authors.a.name}/events/add`, async (_, res) =>
    res.send(await render("pages/events/add.html"))
  );

  app.post(`/${authors.a.name}/events/add`, (req, res) => {
    const {
      name,
      description,
      image,
      categoryId,
      startDateTime,
      duration,
      isActive,
      capacity,
      tickets,
    } = req.body;
    data.events.push(
      new Event(
        name,
        description,
        image,
        categoryId,
        startDateTime,
        duration,
        isActive,
        capacity,
        tickets
      )
    );
    res.redirect(`/${authors.a.name}/events`);
  });

  // ─── List All Events ───────────────────────────────────────────────────────

  app.get(`/${authors.a.name}/events`, async (req, res) => {
    const { keyword } = req.query;
    res.send(await render("pages/events/index.html"));
  });

  // ─── List Sold-out Events ──────────────────────────────────────────────────

  app.get(`/${authors.a.name}/events/sold-out`, async (_, res) => {
    res.send(await render("pages/events/index.html", { soldOutOnly: true }));
  });

  // ─── Category Details ──────────────────────────────────────────────────────

  app.get(`/${authors.a.name}/categories/:id`, async (req, res) => {
    const { id } = req.params;
    res.send(await render("pages/categories/details.html", { id }));
  });

  // ─── Delete Event ──────────────────────────────────────────────────────────

  app.delete(`/${authors.a.name}/events/:id`, async (req, res) => {
    const { id } = req.params;
    data.events = filter(data.events, (c) => c.id !== id);
    res.redirect(`/${authors.a.name}/events`);
  });
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
