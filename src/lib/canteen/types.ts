export type Category = {
  id: number;
  slug: string;
  name: string;
  sort_order: number;
};

export type Dish = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  cost: number;
  weight_g: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  tags: string;
  image_key: string;
  is_available: boolean;
  on_board: boolean;
  featured: boolean;
  portion_limit: number | null;
  portions_sold: number;
  sort_order: number;
};

export type PublicDish = {
  id: number;
  category_id: number;
  category_slug: string;
  category_name: string;
  name: string;
  description: string;
  price: number;
  weight_g: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  tags: string[];
  image_key: string;
  featured: boolean;
  portion_limit: number | null;
  portions_left: number | null;
  sort_order: number;
};

export type AdminDish = PublicDish & {
  cost: number;
  is_available: boolean;
  on_board: boolean;
  portions_sold: number;
};

export type Wish = {
  id: number;
  alias: string;
  body: string;
  votes: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: number;
  dish_id: number | null;
  dish_name: string;
  qty: number;
  unit_price: number;
};

export type Order = {
  id: number;
  pickup_code: string;
  guest_label: string;
  group_code: string;
  status: string;
  total: number;
  discount: number;
  pickup_slot: string;
  note: string;
  created_at: string;
  items: OrderItem[];
};

export type Announcement = {
  id: number;
  title: string;
  body: string;
  is_published: boolean;
  created_at: string;
};

export type SiteInfo = {
  college_name: string;
  canteen_name: string;
  address: string;
  phone: string;
  about: string;
  pickup_rules: string;
  director: string;
  hours: Array<{ days: string; line: string; kitchen: string }>;
};

export type DayPoint = {
  sale_date: string;
  revenue: number;
  cost: number;
  profit: number;
  portions: number;
};

export type DishStat = {
  dish_name: string;
  qty: number;
  revenue: number;
  cost: number;
  profit: number;
};

export type CategoryStat = {
  category: string;
  revenue: number;
};

export type Report = {
  from: string;
  to: string;
  revenue: number;
  cost: number;
  profit: number;
  portions: number;
  orders_online: number;
  days: DayPoint[];
  dishes: DishStat[];
  categories: CategoryStat[];
};

export const ORDER_STATUSES = [
  "paid",
  "cooking",
  "ready",
  "picked_up",
  "cancelled",
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  paid: "Оплачен",
  cooking: "Готовим",
  ready: "Можно забирать",
  picked_up: "Выдан",
  cancelled: "Отменён",
};

export const WISH_STATUS_LABEL: Record<string, string> = {
  new: "Новое",
  planned: "Возьмём в меню",
  done: "Уже в линии",
  declined: "Пока нет",
};

export const PICKUP_SLOTS = [
  "11:00–11:30",
  "11:30–12:00",
  "12:00–12:30",
  "12:30–13:00",
  "13:00–13:30",
  "13:30–14:00",
  "14:00–14:30",
  "14:30–15:00",
];

export const COMBO_DISCOUNT = 40;
export const STAFF_PIN_HINT = "2468";

export const WEEKDAYS = [
  { id: 1, short: "Пн", full: "Понедельник" },
  { id: 2, short: "Вт", full: "Вторник" },
  { id: 3, short: "Ср", full: "Среда" },
  { id: 4, short: "Чт", full: "Четверг" },
  { id: 5, short: "Пт", full: "Пятница" },
  { id: 6, short: "Сб", full: "Суббота" },
];
