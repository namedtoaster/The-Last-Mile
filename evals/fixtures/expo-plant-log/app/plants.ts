import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('plants.db');
db.execSync('CREATE TABLE IF NOT EXISTS plants (id INTEGER PRIMARY KEY, name TEXT, everyDays INTEGER, lastWatered TEXT)');

export function usePlants() {
  return db.getAllSync<{ id: number; name: string; everyDays: number }>('SELECT id, name, everyDays FROM plants');
}

export function markWatered(id: number) {
  db.runSync('UPDATE plants SET lastWatered = ? WHERE id = ?', new Date().toISOString(), id);
}
