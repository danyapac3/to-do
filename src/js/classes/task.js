const validateTitle = t => {
  const formatedTitle = t.trim();
  if (typeof t !== 'string') throw new Error('title must be a string');
  if (formatedTitle.length < 1) throw new Error('title must contain at least one character');
  return formatedTitle;
}


const validateDescription = d => {
  if (typeof d !== 'string') throw new Error('description must be a string');
  return d.trim();
}


const validatePriority = p => {
  if (typeof p !== 'number') throw new Error('priority must be a number');
  if (!Number.isInteger(p)) throw new Error('priority must be an integer number');
  if (p < 1 || p > 4) throw new Error('priority must be in range from 1 to 4');
  return p;
}


const validateDueDate = d => {
  if (!(d instanceof Date) && d !== null) throw new Error('dueDate must be a Date or null');
  return d;
}


export class Task {
  #title;
  #description;
  #priority;
  #dueDate;
  #subtasks;

  constructor(title, description = '', priority = 4, dueDate = null) {
    this.#title = validateTitle(title);
    this.#description = validateDescription(description);
    this.#priority = validatePriority(priority);
    this.#dueDate = validateDueDate(dueDate);
  }

  getTitle() { return this.#title; }
  setTitle(t) { this.#title = validateTitle(t); }

  getDescription() { return this.#description; }
  setDescription(d) { this.#description = validateDescription(d); }

  getPriority() { return this.#priority; }
  setPriority(p) { this.#priority = validatePriority(p); }

  getDueDate() { return this.#dueDate; }
  setDueDate(d) { this.#dueDate = validateDueDate(d); }
}