/**
 * Binary Search Tree - Core Data Structure
 *
 * ⚠️  NOTA PARA EL ESTUDIANTE:
 * Este archivo contiene la lógica central del BST.
 * Hay errores intencionales que debes encontrar y corregir.
 * Lee cada función con cuidado antes de modificar.
 */

// ─── Node Factory ────────────────────────────────────────────────────────────

/**
 * Crea un nodo para el BST.
 * @param {number} value
 * @returns {{ value: number, left: null, right: null }}
 */
export const createNode = (value) => ({
  value,
  left: null,
  right: null,
});

// ─── Core Operations ─────────────────────────────────────────────────────────

/**
 * Inserta un valor en el árbol.
 * 
 * FIX #1: Los valores menores que el nodo actual se insertan a la izquierda.
 * BUG #2: No maneja el caso en que `node` es null desde el inicio
 *         (falla silenciosamente en el primer insert si el root es null).
 *
 * @param {object|null} node - Nodo raíz del subárbol actual
 * @param {number} value - Valor a insertar
 * @returns {object} - Nuevo subárbol con el valor insertado
 */
export const insert = (node, value) => {
  if (node === null) {
    return createNode(value); // ← Esto está bien, pero ¿cuándo se usa?
  }

  if (value > node.value) {
    return {
      ...node,
      right: insert(node.right, value),
    };
  }

  if (value < node.value) {
    return {
      ...node,
      left: insert(node.left, value),
    };
  }

  // Los duplicados simplemente caen aquí y retornan el nodo sin cambios
  return node;
};

/**
 * Busca un valor en el árbol.
 *
 * BUG #3: Usa == en vez de ===, lo que causa coerción de tipos.
 * Buscar "5" (string) encontrará el nodo con valor 5 (number).
 *
 * @param {object|null} node
 * @param {number|string} value
 * @returns {object|null} - El nodo encontrado, o null
 */
export const search = (node, value) => {
  if (node === null) return null;

  // BUG: == permite coerción: search(root, "10") === search(root, 10)
  if (node.value == value) return node; // eslint-disable-line eqeqeq

  if (value < node.value) {
    return search(node.left, value);
  }

  return search(node.right, value);
};

// ─── Traversals ──────────────────────────────────────────────────────────────

/**
 * Recorrido In-Order (izquierda → raíz → derecha).
 * En un BST válido, produce los valores en orden ascendente.
 *
 * TODO: Implementar esta función.
 * Debe retornar un array de valores en orden in-order.
 *
 * @param {object|null} node
 * @returns {number[]}
 */
export const inOrder = (node) => {
  // TODO: Implementar
  return [];
};

/**
 * Recorrido Pre-Order (raíz → izquierda → derecha).
 *
 * TODO: Implementar esta función.
 *
 * @param {object|null} node
 * @returns {number[]}
 */
export const preOrder = (node) => {
  // TODO: Implementar
  return [];
};

/**
 * Recorrido Post-Order (izquierda → derecha → raíz).
 *
 * TODO: Implementar esta función.
 *
 * @param {object|null} node
 * @returns {number[]}
 */
export const postOrder = (node) => {
  // TODO: Implementar
  return [];
};

// ─── Tree Transformation ─────────────────────────────────────────────────────

/**
 * Transforma la estructura interna del BST al formato que espera react-d3-tree.
 *
 * react-d3-tree espera: { name: string, children: Array }
 * Nuestra estructura interna es: { value: number, left: Node|null, right: Node|null }
 *
 * BUG #4 (sutil): Esta función ignora el hijo derecho cuando un nodo
 * tiene SOLO hijo derecho (no tiene hijo izquierdo).
 * Pruébalo insertando: 10, 15, 20 → el árbol visual se rompe.
 *
 * @param {object|null} node
 * @returns {object|null} - Nodo en formato react-d3-tree, o null
 */
export const toD3Format = (node) => {
  if (node === null) return null;

  const children = [];

  // BUG: Si node.left es null pero node.right no, nunca se agrega node.right
  if (node.left !== null) {
    children.push(toD3Format(node.left));

    if (node.right !== null) {
      children.push(toD3Format(node.right));
    }
  }

  return {
    name: String(node.value),
    children,
  };
};

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Calcula la altura del árbol.
 * TODO: Implementar. Útil para validar que el BST está balanceado.
 *
 * @param {object|null} node
 * @returns {number}
 */
export const getHeight = (node) => {
  // TODO: Implementar
  return 0;
};

/**
 * Genera un número entero aleatorio entre min y max (inclusivo).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
