export default function groupBy(list, prop) {
  const map = new Map();

  for (const item of list) {
    const key = item[prop] !== undefined ? item[prop] : item.get(prop);
    const collection = map.get(key) ?? [];
    map.set(key, [...collection, item]);
  }

  return map;
}
