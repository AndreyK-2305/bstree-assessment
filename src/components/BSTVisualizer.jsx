/**
 * BSTVisualizer.jsx
 *
 * Componente principal del visualizador de Árbol Binario de Búsqueda.
 *
 * ⚠️  NOTA PARA EL ESTUDIANTE:
 * Este componente tiene problemas de rendimiento y un bug de UX.
 * Usa React DevTools Profiler para encontrarlos.
 */

import { useState, useCallback, useMemo } from "react";
import Tree from "react-d3-tree";

import { insert, search, inOrder, preOrder, postOrder, toD3Format, randomInt } from "../utils/bst";
import TraversalPanel from "./TraversalPanel";
import SearchBar from "./SearchBar";

import styles from "./BSTVisualizer.module.css";

// FIX #5: Este helper vive fuera del componente; useMemo evita recalcular
// recorridos costosos cuando root y activeTraversal no han cambiado.
const getTraversalResult = (root, type) => {
  switch (type) {
    case "inOrder":   return inOrder(root);
    case "preOrder":  return preOrder(root);
    case "postOrder": return postOrder(root);
    default: return [];
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function BSTVisualizer() {
  const [root, setRoot]                   = useState(null);
  const [inputValue, setInputValue]       = useState("");
  const [activeTraversal, setTraversal]   = useState(null); // "inOrder" | "preOrder" | "postOrder"
  const [searchTerm, setSearchTerm]       = useState("");
  const [foundNode, setFoundNode]         = useState(null);
  const [errorMessage, setErrorMessage]   = useState("");

  // ── Insert ──────────────────────────────────────────────────────────────────
  const handleInsert = () => {
    const parsed = parseInt(inputValue, 10);

    // BUG #6 (UX): Acepta NaN silenciosamente. Si el usuario escribe
    // "abc" y presiona insertar, no pasa nada y no hay feedback.
    // El error se traga. Debes manejar este caso y mostrar el errorMessage.
    if (!isNaN(parsed)) {
      setRoot((prevRoot) => insert(prevRoot, parsed));
      setInputValue("");
      setErrorMessage("");
    }
  };

  // ── Random Insert ───────────────────────────────────────────────────────────
  const handleRandomInsert = () => {
    const value = randomInt(1, 99);
    setRoot((prevRoot) => insert(prevRoot, value));
  };

  // ── Search ──────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const parsed = parseInt(searchTerm, 10);
    const result = search(root, parsed);
    setFoundNode(result ? result.value : null);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  // useMemo evita transformar todo el árbol en cada render que no cambie root.
  const d3Data = useMemo(() => (root ? toD3Format(root) : null), [root]);

  // useMemo evita recalcular recorridos cuando cambia otro estado de la UI.
  const traversalResult = useMemo(
    () => (activeTraversal ? getTraversalResult(root, activeTraversal) : []),
    [activeTraversal, root]
  );

  // ── Node Rendering ──────────────────────────────────────────────────────────
  /**
   * Función de render personalizada para cada nodo del árbol.
   * TODO: El estudiante debe modificar esto para que los nodos
   * que coincidan con `foundNode` se resalten visualmente.
   */
  const renderCustomNode = useCallback(({ nodeDatum }) => (
    <g>
      {/* TODO: Cambiar el color del círculo si nodeDatum.name === String(foundNode) */}
      <circle r={20} fill="#4A90D9" stroke="#fff" strokeWidth={2} />
      <text
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {nodeDatum.name}
      </text>
    </g>
  ), []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>BST Visualizer</h1>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="Ingresa un número..."
            className={styles.input}
          />
          <button onClick={handleInsert} className={styles.button}>
            Insertar
          </button>
          <button onClick={handleRandomInsert} className={`${styles.button} ${styles.secondary}`}>
            🎲 Aleatorio
          </button>
        </div>

        {/* TODO: Renderizar errorMessage aquí cuando exista */}

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          result={foundNode}
        />
      </div>

      {/* Traversal Selector */}
      <TraversalPanel
        active={activeTraversal}
        onChange={setTraversal}
        result={traversalResult}
      />

      {/* Tree Visualization */}
      <div className={styles.treeContainer}>
        {d3Data ? (
          <Tree
            data={d3Data}
            orientation="vertical"
            renderCustomNodeElement={renderCustomNode}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            translate={{ x: 400, y: 60 }}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>El árbol está vacío.</p>
            <p>Inserta un número para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
