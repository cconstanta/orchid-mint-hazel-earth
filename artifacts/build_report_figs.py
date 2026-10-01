#!/usr/bin/env python3
"""Academic diagrams for the cafeteria practice report."""
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Ellipse, Rectangle, Polygon
from matplotlib.lines import Line2D

OUT = Path("/workspace/artifacts/report_figs")
OUT.mkdir(parents=True, exist_ok=True)

plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["axes.unicode_minus"] = False

NAVY = "#1A5276"
TEAL = "#148A80"
FILL = "#D6EAF8"
FILL2 = "#D5F5E3"
FILL3 = "#FCF3CF"
PINK = "#F5B7B1"
GRAY = "#F4F6F7"
INK = "#1B2631"
ACTOR = "#5D6D7E"


def fig(w=12.0, h=7.2):
    f, ax = plt.subplots(figsize=(w, h), dpi=160)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")
    f.patch.set_facecolor("white")
    ax.set_facecolor("white")
    return f, ax


def box(ax, x, y, w, h, text, fc=FILL, ec=NAVY, fs=9, fw="bold", radius=0.02):
    p = FancyBboxPatch(
        (x, y), w, h, boxstyle=f"round,pad=0.4,rounding_size={radius * 40}",
        linewidth=1.4, edgecolor=ec, facecolor=fc, mutation_aspect=0.6,
    )
    ax.add_patch(p)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=fs, fontweight=fw, color=INK, wrap=True)


def arrow(ax, x1, y1, x2, y2, text="", side="center", color=NAVY):
    ax.annotate(
        "", xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(arrowstyle="-|>", color=color, lw=1.3,
                        mutation_scale=12),
    )
    if text:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        if side == "up":
            my += 2.2
        elif side == "down":
            my -= 2.4
        elif side == "left":
            mx -= 3
        elif side == "right":
            mx += 3
        ax.text(mx, my, text, ha="center", va="center", fontsize=7.5,
                color=NAVY, bbox=dict(boxstyle="round,pad=0.15", fc="white",
                                      ec="none", alpha=0.9))


def save(f, name):
    f.tight_layout(pad=0.4)
    path = OUT / name
    f.savefig(path, bbox_inches="tight", facecolor="white")
    plt.close(f)
    print("wrote", path)


# --- 1 org ---
f, ax = fig(11, 7.4)
box(ax, 32, 86, 36, 10, "Директор колледжа\nГБПОУ НСО «НЭК»", FILL, NAVY, 10)
arrow(ax, 50, 86, 50, 78)
box(ax, 30, 66, 40, 12, "Заведующая столовой\nучёт, меню, отчёты, персонал", FILL2, TEAL, 10)
arrow(ax, 38, 66, 22, 56)
arrow(ax, 50, 66, 50, 56)
arrow(ax, 62, 66, 78, 56)
box(ax, 6, 42, 28, 14, "Повара / кухня\nприготовление,\nстатус предзаказов", FILL3, "#B7950B", 9)
box(ax, 36, 42, 28, 14, "Касса / раздача\nвыдача по коду,\nпродажи с линии", FILL, NAVY, 9)
box(ax, 66, 42, 28, 14, "Сотрудник учёта\nимпорт CSV, отчёты,\nконструктор меню", FILL2, TEAL, 9)
arrow(ax, 50, 42, 50, 32)
box(ax, 18, 10, 64, 22, "Гости (студенты, преподаватели, сотрудники)\nпросмотр меню без входа · предзаказ с предоплатой · пожелания",
     GRAY, ACTOR, 10, "normal")
save(f, "fig01_org.png")

# --- 2 IDEF0 A-0 ---
f, ax = fig(12.2, 7.6)
box(ax, 32, 38, 36, 24, "Вести операционный учёт\nстоловой колледжа\n\nA0  «Перемена»", FILL, NAVY, 11)
# inputs left
ax.annotate("", xy=(32, 54), xytext=(4, 54),
            arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.4))
ax.text(4, 62, "Вход", fontsize=8, color=NAVY, fontweight="bold")
ax.text(5, 56.5, "карточки блюд\nпродажи кассы (CSV)\nпожелания гостей", fontsize=7.5, color=INK)
# outputs right
ax.annotate("", xy=(96, 54), xytext=(68, 54),
            arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.4))
ax.text(70, 62, "Выход", fontsize=8, color=NAVY, fontweight="bold")
ax.text(70, 56.5, "меню на линии\nкод выдачи\nотчёты прибыли\nобъявления", fontsize=7.5, color=INK)
# control top
ax.annotate("", xy=(50, 62), xytext=(50, 88),
            arrowprops=dict(arrowstyle="-|>", color=TEAL, lw=1.4))
ax.text(52, 84, "Управление: СанПиН, график работы,\nлокальные акты колледжа, PIN сотрудника",
        fontsize=8, color=TEAL)
# mech bottom
ax.annotate("", xy=(50, 38), xytext=(50, 12),
            arrowprops=dict(arrowstyle="-|>", color="#7D3C98", lw=1.4))
ax.text(52, 18, "Механизм: заведующая, повар, кассир,\nвеб-приложение, PostgreSQL / PGLite",
        fontsize=8, color="#7D3C98")
save(f, "fig02_idef0.png")

# --- 3 IDEF0 decomp ---
f, ax = fig(12.4, 7.8)
ax.text(50, 96, "Декомпозиция A0", ha="center", fontsize=11, fontweight="bold", color=NAVY)
nodes = [
    (8, 58, "A1\nСобрать меню\nна день"),
    (30, 58, "A2\nПринять\nпредзаказ"),
    (52, 58, "A3\nОбработать\nна кухне"),
    (74, 58, "A4\nУчесть\nпродажи"),
]
for x, y, t in nodes:
    box(ax, x, y, 18, 20, t, FILL, NAVY, 9)
box(ax, 41, 18, 18, 20, "A5\nСформировать\nотчёты", FILL2, TEAL, 9)
for x in (26, 48, 70):
    arrow(ax, x, 68, x + 4, 68)
arrow(ax, 83, 58, 50, 38)
arrow(ax, 17, 58, 41, 38, "", "down")
ax.text(8, 84, "план недели, картотека", fontsize=7.5, color=NAVY)
ax.text(78, 84, "CSV кассы, заказы", fontsize=7.5, color=NAVY)
ax.text(62, 12, "выручка, прибыль, топ блюд", fontsize=7.5, color=TEAL)
ax.annotate("", xy=(8, 78), xytext=(8, 90),
            arrowprops=dict(arrowstyle="-|>", color=TEAL, lw=1.2))
ax.text(10, 90, "график / СанПиН", fontsize=7.5, color=TEAL)
save(f, "fig03_idef0_a0.png")

# --- 4 DFD ---
f, ax = fig(12.4, 7.8)

def actor(ax, x, y, name):
    ax.add_patch(Circle((x, y + 6), 2.2, fill=False, ec=ACTOR, lw=1.3))
    ax.plot([x, x], [y + 3.8, y + 0.5], color=ACTOR, lw=1.3)
    ax.plot([x - 2.2, x + 2.2], [y + 2.4, y + 2.4], color=ACTOR, lw=1.3)
    ax.plot([x, x - 1.8], [y + 0.5, y - 3], color=ACTOR, lw=1.3)
    ax.plot([x, x + 1.8], [y + 0.5, y - 3], color=ACTOR, lw=1.3)
    ax.text(x, y - 6.2, name, ha="center", fontsize=8, color=INK)

def store(ax, x, y, w, h, text):
    ax.add_patch(Rectangle((x, y), w, h, fill=True, fc="#FDEBD0", ec=NAVY, lw=1.2))
    ax.plot([x + 1.2, x + 1.2], [y, y + h], color=NAVY, lw=1.2)
    ax.plot([x + w - 1.2, x + w - 1.2], [y, y + h], color=NAVY, lw=1.2)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=8)

actor(ax, 10, 78, "Гость")
actor(ax, 10, 28, "Сотрудник")
actor(ax, 90, 78, "Касса\n(файл CSV)")
box(ax, 28, 78, 18, 12, "1.0\nМеню на линии", FILL, NAVY, 8)
box(ax, 52, 78, 18, 12, "2.0\nПредзаказ", FILL, NAVY, 8)
box(ax, 40, 48, 20, 12, "3.0\nКухня / выдача", FILL, NAVY, 8)
box(ax, 28, 18, 18, 12, "4.0\nИмпорт продаж", FILL, NAVY, 8)
box(ax, 52, 18, 18, 12, "5.0\nОтчёты", FILL2, TEAL, 8)
store(ax, 78, 48, 18, 10, "D1 Блюда")
store(ax, 78, 32, 18, 10, "D2 Заказы")
store(ax, 78, 16, 18, 10, "D3 Продажи")
store(ax, 78, 0.5, 18, 10, "D4 Пожелания")
arrow(ax, 16, 82, 28, 84)
arrow(ax, 46, 84, 52, 84)
arrow(ax, 70, 84, 84, 78)
arrow(ax, 61, 78, 50, 60)
arrow(ax, 16, 30, 28, 24)
arrow(ax, 46, 24, 52, 24)
arrow(ax, 70, 24, 78, 22)
ax.text(50, 96, "DFD. Уровень 1 — потоки данных столовой", ha="center",
        fontsize=11, fontweight="bold", color=NAVY)
save(f, "fig04_dfd.png")

# --- 5 use case ---
f, ax = fig(12.2, 8.0)
ax.add_patch(FancyBboxPatch((18, 8), 64, 84, boxstyle="round,pad=0.6,rounding_size=8",
                            fill=False, ec=NAVY, lw=1.2, linestyle="--"))
ax.text(50, 88, "Система «Столовая Перемена»", ha="center", fontsize=10,
        fontweight="bold", color=NAVY)
actor(ax, 8, 55, "Гость")
actor(ax, 92, 55, "Сотрудник\n(PIN 2468)")
usecases = [
    (36, 74, "Смотреть меню"),
    (36, 62, "Собрать комплекс"),
    (36, 50, "Оплатить предзаказ"),
    (36, 38, "Забрать по коду"),
    (36, 26, "Оставить пожелание"),
    (62, 74, "Собрать линию"),
    (62, 62, "Вести статусы кухни"),
    (62, 50, "Импортировать CSV"),
    (62, 38, "Смотреть отчёты"),
    (62, 26, "Модерировать идеи"),
]
for x, y, t in usecases:
    e = Ellipse((x, y), 22, 9, facecolor=FILL, edgecolor=NAVY, lw=1.2)
    ax.add_patch(e)
    ax.text(x, y, t, ha="center", va="center", fontsize=8)
# links guest
for y in (74, 62, 50, 38, 26):
    ax.plot([12, 25], [55 if y > 40 else 48, y], color=ACTOR, lw=0.9)
for y in (74, 62, 50, 38, 26):
    ax.plot([88, 73], [55, y], color=TEAL, lw=0.9)
save(f, "fig05_usecase.png")

# --- 6 sequence ---
f, ax = fig(12.4, 7.6)
ax.set_ylim(0, 100)
lifelines = [("Гость", 12), ("Интерфейс", 34), ("placeOrder", 58), ("БД", 78), ("Кухня", 94)]
for name, x in lifelines:
    ax.text(x, 96, name, ha="center", fontsize=9, fontweight="bold", color=NAVY)
    ax.plot([x, x], [8, 92], color="#BFC9CA", lw=1.1, linestyle="--")

def msg(y, x1, x2, text, dashed=False):
    style = "-|>" 
    ax.annotate("", xy=(x2, y), xytext=(x1, y),
                arrowprops=dict(arrowstyle=style, color=NAVY, lw=1.15,
                                linestyle="dashed" if dashed else "solid"))
    ax.text((x1 + x2) / 2, y + 2.1, text, ha="center", fontsize=7.2, color=INK)

msg(84, 12, 34, "поднос, имя, группа, слот")
msg(74, 34, 58, "placeOrder()")
msg(64, 58, 78, "INSERT orders, sales_lines")
msg(54, 78, 58, "pickup_code", dashed=True)
msg(44, 58, 34, "код + сумма", dashed=True)
msg(34, 34, 12, "страница выдачи", dashed=True)
msg(22, 94, 78, "status: cooking → ready")
msg(12, 12, 78, "опрос статуса по коду")
save(f, "fig06_seq.png")

# --- 7 classes ---
f, ax = fig(12.4, 7.8)

def clazz(ax, x, y, w, h, title, body):
    ax.add_patch(Rectangle((x, y), w, h, fc="white", ec=NAVY, lw=1.3))
    ax.add_patch(Rectangle((x, y + h - 8), w, 8, fc=FILL, ec=NAVY, lw=1.3))
    ax.text(x + w / 2, y + h - 4, title, ha="center", va="center",
            fontsize=8.5, fontweight="bold", color=NAVY)
    ax.text(x + 1.2, y + h - 11, body, ha="left", va="top", fontsize=7.2,
            family="DejaVu Sans Mono", color=INK)

clazz(ax, 4, 55, 28, 40, "Category", "+ id: int\n+ slug: text\n+ name: text")
clazz(ax, 36, 48, 30, 47, "Dish", "+ id, category_id\n+ name, price, cost\n+ on_board, featured\n+ portion_limit")
clazz(ax, 70, 55, 26, 40, "WeekdayPlan", "+ weekday: 1..6\n+ dish_id")
clazz(ax, 4, 6, 28, 38, "Order", "+ pickup_code\n+ status\n+ total, discount\n+ pickup_slot")
clazz(ax, 36, 6, 30, 38, "OrderItem", "+ order_id, dish_id\n+ qty, unit_price")
clazz(ax, 70, 6, 26, 38, "SalesLine", "+ sale_date\n+ qty, price, cost\n+ source: import|order")
arrow(ax, 32, 75, 36, 75)
arrow(ax, 66, 70, 70, 70)
arrow(ax, 32, 24, 36, 24)
arrow(ax, 66, 24, 70, 24)
save(f, "fig07_classes.png")

# --- 8 ER ---
f, ax = fig(12.6, 8.0)

def er(ax, x, y, w, h, title, rows):
    ax.add_patch(Rectangle((x, y), w, h, fc="white", ec=NAVY, lw=1.2))
    ax.add_patch(Rectangle((x, y + h - 7), w, 7, fc="#1A5276", ec=NAVY, lw=1.2))
    ax.text(x + w / 2, y + h - 3.5, title, ha="center", va="center",
            fontsize=8, fontweight="bold", color="white")
    ax.text(x + 1, y + h - 9, rows, ha="left", va="top", fontsize=6.8,
            family="DejaVu Sans Mono", color=INK)

er(ax, 2, 62, 22, 34, "categories", "PK id\n   slug UQ\n   name")
er(ax, 30, 54, 24, 42, "dishes", "PK id\nFK category_id\n   price, cost\n   on_board")
er(ax, 60, 64, 18, 32, "weekday_plan", "PK weekday\nPK dish_id")
er(ax, 82, 64, 16, 32, "wishes", "PK id\n   votes\n   status")
er(ax, 2, 8, 24, 40, "orders", "PK id\nUQ pickup_code\n   status, total")
er(ax, 32, 8, 24, 40, "order_items", "PK id\nFK order_id\nFK dish_id")
er(ax, 60, 8, 22, 40, "sales_lines", "PK id\nFK dish_id\n   sale_date")
er(ax, 84, 8, 14, 28, "announcements", "PK id\n   title")
arrow(ax, 24, 78, 30, 78)
arrow(ax, 54, 72, 60, 72)
arrow(ax, 26, 28, 32, 28)
arrow(ax, 54, 28, 60, 28)
ax.text(50, 3, "1  ———  N   внешние ключи; weekday_plan — M:N блюда и дня недели",
        ha="center", fontsize=8, color=NAVY)
save(f, "fig08_er.png")

# --- 9 logical schema list as boxes ---
f, ax = fig(12.2, 7.4)
ax.text(50, 96, "Логическая схема — перечень отношений", ha="center",
        fontsize=12, fontweight="bold", color=NAVY)
items = [
    (6, 72, "categories"), (30, 72, "dishes"), (54, 72, "weekday_plan"),
    (78, 72, "site_settings"),
    (6, 46, "orders"), (30, 46, "order_items"), (54, 46, "sales_lines"),
    (78, 46, "wishes"),
    (30, 20, "announcements"),
]
for x, y, t in items:
    box(ax, x, y, 18, 14, t, FILL, NAVY, 9)
ax.annotate("", xy=(30, 79), xytext=(24, 79), arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.1))
ax.annotate("", xy=(30, 53), xytext=(24, 53), arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.1))
ax.annotate("", xy=(54, 53), xytext=(48, 53), arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.1))
ax.annotate("", xy=(39, 34), xytext=(39, 46), arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.1))
save(f, "fig09_schema.png")

# --- 10 layers ---
f, ax = fig(11.5, 7.2)
layers = [
    (18, 78, 64, 14, "Представление  ·  React 19, TanStack Router, Tailwind", FILL),
    (18, 60, 64, 14, "Состояние клиента  ·  Zustand (корзина), TanStack Query", FILL2),
    (18, 42, 64, 14, "Серверные функции  ·  createServerFn, Zod", FILL3),
    (18, 24, 64, 14, "Предметная логика  ·  src/lib/canteen (меню, заказ, отчёты)", PINK),
    (18, 6, 64, 14, "Данные  ·  PostgreSQL / PGLite, миграция 0002_canteen.sql", "#D7BDE2"),
]
for x, y, w, h, t, c in layers:
    box(ax, x, y, w, h, t, c, NAVY, 10, "normal")
    if y < 78:
        ax.annotate("", xy=(50, y + h), xytext=(50, y + h + 4),
                    arrowprops=dict(arrowstyle="-|>", color=NAVY, lw=1.1))
save(f, "fig10_arch.png")

print("done")
