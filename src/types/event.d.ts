export interface Event {
  uuid: string;
  selector: string;
  index: number;
  label: string;
  action: {
    type: "click" | "input";
    inputValue?: string;
  };
  createdAt: string;
  updatedAt: string;
}
