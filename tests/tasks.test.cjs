const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  constructor(tag = 'div') {
    this.tag = tag; this.children = []; this.dataset = {}; this.attrs = {};
    this.listeners = {}; this.value = ''; this.className = '';
  }
  set textContent(value) { this.text = String(value); }
  get textContent() { return this.text ?? this.children.map(c => c.textContent).join(''); }
  setAttribute(key, value) { this.attrs[key] = value; }
  append(...children) { for (const child of children) { child.parent = this; this.children.push(child); } }
  replaceChildren() { this.children = []; }
  addEventListener(name, handler) { this.listeners[name] = handler; }
  contains(child) { while (child) { if (child === this) return true; child = child.parent; } return false; }
  closest(selector) { return selector === 'button[data-action]' && this.tag === 'button' ? this : this.parent?.closest(selector) ?? null; }
  focus() {}
}
function setup(saved = '[]') {
  const add = new Element('button'), input = new Element('input'), list = new Element('ul');
  const storage = new Map([['lista', saved]]);
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const document = {
    querySelector: selector => ({ '.button-add-task': add, '.input-task': input, '.list-task': list })[selector],
    createElement: tag => new Element(tag),
  };
  const source = fs.readFileSync('src/js/script.js', 'utf8');
  vm.runInNewContext(source, { document, localStorage, console });
  return { add, input, list, storage, source };
}
test('não interpreta conteúdo de tarefas como HTML', () => {
  const app = setup();
  app.input.value = '<img src=x onerror=alert(1)>';
  app.add.listeners.click();
  assert.equal(app.list.children[0].children[1].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(app.source.includes('innerHTML'), false);
});
test('mantém tarefas existentes e salva operações', () => {
  const app = setup(JSON.stringify([{ tarefa: 'Anterior', concluida: false }]));
  assert.equal(app.list.children.length, 1);
  app.input.value = 'Nova';
  app.input.listeners.keydown({ key: 'Enter' });
  assert.equal(app.list.children.length, 2);
  app.list.listeners.click({ target: app.list.children[1].children[0] });
  assert.equal(app.list.children[1].className, 'task done');
  app.list.listeners.click({ target: app.list.children[1].children[2] });
  assert.equal(app.list.children.length, 1);
  assert.equal(JSON.parse(app.storage.get('lista'))[0].tarefa, 'Anterior');
});
test('ignora tarefa em branco e suporta localStorage corrompido', () => {
  const app = setup('{invalido');
  app.input.value = '   ';
  app.add.listeners.click();
  assert.equal(app.list.children.length, 0);
});
