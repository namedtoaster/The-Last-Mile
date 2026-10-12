import * as SQLite from 'expo-sqlite';

export type Plant = { id: number; name: string; everyDays: number; lastWatered: string | null };

const db = SQLite.openDatabaseSync('plants.db');
db.execSync('CREATE TABLE IF NOT EXISTS plants (id INTEGER PRIMARY KEY, name TEXT, everyDays INTEGER, lastWatered TEXT)');

export function listPlants(): Plant[] {
  return db.getAllSync<Plant>('SELECT id, name, everyDays, lastWatered FROM plants ORDER BY name');
}

export function addPlant(name: string, everyDays: number) {
  db.runSync('INSERT INTO plants (name, everyDays) VALUES (?, ?)', name, everyDays);
}

export function markWatered(id: number) {
  db.runSync('UPDATE plants SET lastWatered = ? WHERE id = ?', new Date().toISOString(), id);
}

export function removePlant(id: number) {
  db.runSync('DELETE FROM plants WHERE id = ?', id);
}
