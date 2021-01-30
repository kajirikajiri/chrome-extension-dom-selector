import { Event } from "../../../../types/event";

export interface EventsList {
  eventsUuid: string;
  label: string;
  events: Event[];
  createdAt: string;
  updatedAt: string;
}
