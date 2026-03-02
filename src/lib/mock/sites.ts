export interface Site {
  id: string;
  name: string;
  location: string;
  type: string;
  active: boolean;
}

export const SITES: Site[] = [
  {
    id: "site-alpha",
    name: "Site Alpha",
    location: "Northern Territory",
    type: "Gold",
    active: true,
  },
  {
    id: "site-beta",
    name: "Site Beta",
    location: "Western Ridge",
    type: "Copper",
    active: true,
  },
  {
    id: "site-gamma",
    name: "Site Gamma",
    location: "Deep Valley",
    type: "Lithium",
    active: true,
  },
];
