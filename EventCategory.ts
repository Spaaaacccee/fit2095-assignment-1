import { id } from "./id";

export class EventCategory {
  id: string = id("C");
  createdAt: Date = new Date();
  constructor(
    public name: string,
    public description?: string,
    public image?: string
  ) {}
}
