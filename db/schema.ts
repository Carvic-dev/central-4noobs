import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(), 
});

export const levels = pgTable('levels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(), 
});

export const materials = pgTable('materials', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'), 
  githubUrl: text('github_url').notNull().unique(), 
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  levelId: integer('level_id').references(() => levels.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  materials: many(materials),
}));

export const levelsRelations = relations(levels, ({ many }) => ({
  materials: many(materials),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
  category: one(categories, {
    fields: [materials.categoryId],
    references: [categories.id],
  }),
  level: one(levels, {
    fields: [materials.levelId],
    references: [levels.id],
  }),
}));