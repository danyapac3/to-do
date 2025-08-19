export default (() => {
  const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  }

  const load = (key) => {
    const item = localStorage.getItem(key);
    if (item === 'null') return null;

    try {
      return JSON.parse(item);
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  const remove = (key) => {
    localStorage.removeItem(key);
  }

  return {save, load, remove}
})();