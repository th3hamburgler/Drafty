export default function groupBy(list, prop) {
  const map = new Map();
  list.forEach((item) => {
    const key = item.get === undefined ? item[prop] : item.get(prop);

    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
