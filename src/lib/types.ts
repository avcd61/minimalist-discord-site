
export interface Project {
  name: string;
  logo: string;
  link: string;
  description?: string;
  images?: string[];
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  appUrl?: string;
  featured?: boolean;
}
