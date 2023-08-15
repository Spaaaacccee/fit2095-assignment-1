import { id } from "./id";

export class Event {
  id: string = id("E");
  constructor(
    public name: string,
    public description: string,
    public image: string,
    public categoryId: string,
    public startDateTime: Date,
    /**
     * Duration of the event in minutes.
     */
    public duration: number,
    public isActive: boolean = true,
    public capacity: number = 10000,
    /**
     * Number of available tickets.
     */
    public tickets: number = capacity
  ) {}
}
