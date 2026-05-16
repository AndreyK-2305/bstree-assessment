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

import { insert, search, inOrder, preOrder, postOrder, getHeight, toD3Format, randomInt } from "../utils/bst";
import TraversalPanel from "./TraversalPanel";
import SearchBar from "./SearchBar";

import styles from "./BSTVisualizer.module.css";

// Helper puro para seleccionar el recorrido activo.
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
  const [treeHeight, setTreeHeight]       = useState(null);

  // ── Insert ──────────────────────────────────────────────────────────────────
  const handleInsert = () => {
    const trimmedValue = inputValue.trim();
    const parsed = Number(trimmedValue);

    if (trimmedValue === "" || !Number.isFinite(parsed)) {
      setErrorMessage("Ingresa un valor numérico antes de insertar.");
      return;
    }

    setRoot((prevRoot) => insert(prevRoot, parsed));
    setInputValue("");
    setErrorMessage("");
    setTreeHeight(null);
  };

  // ── Random Insert ───────────────────────────────────────────────────────────
  const handleRandomInsert = () => {
    const value = randomInt(1, 99);
    setRoot((prevRoot) => insert(prevRoot, value));
    setTreeHeight(null);
  };

  // ── Search ──────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const parsed = parseInt(searchTerm, 10);
    const result = search(root, parsed);
    setFoundNode(result ? result.value : null);
  };

  // ── Height ─────────────────────────────────────────────────────────────────
  const handleCalculateHeight = () => {
    setTreeHeight(getHeight(root));
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  // useMemo evita reconstruir el formato de react-d3-tree cuando solo cambia
  // estado de UI como inputValue, searchTerm o errorMessage.
  const d3Data = useMemo(() => (root ? toD3Format(root) : null), [root]);

  // useMemo evita recalcular recorridos completos salvo que cambie el árbol
  // o el tipo de recorrido seleccionado.
  const traversalResult = useMemo(
    () => (activeTraversal ? getTraversalResult(root, activeTraversal) : []),
    [activeTraversal, root]
  );

  // ── Node Rendering ──────────────────────────────────────────────────────────
  /**
   * Función de render personalizada para cada nodo del árbol.
   * useCallback mantiene estable la referencia que recibe react-d3-tree y
   * solo la actualiza cuando cambia el nodo encontrado que afecta el color.
   */
  const renderCustomNode = useCallback(({ nodeDatum }) => {
    const isFoundNode = foundNode !== null && nodeDatum.name === String(foundNode);
    const fontSize = nodeDatum.name.length > 2 ? 11 : 14;

    return (
      <g>
        <circle
          r={20}
          fill={isFoundNode ? "#f59e0b" : "#4A90D9"}
          stroke={isFoundNode ? "#fef3c7" : "#fff"}
          strokeWidth={isFoundNode ? 3 : 2}
        />
        <text
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
          fontSize={fontSize}
          fontWeight={700}
          letterSpacing="0"
          paintOrder="stroke"
          stroke="#0f172a"
          strokeWidth={0.75}
        >
          {nodeDatum.name}
        </text>
      </g>
    );
  }, [foundNode]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>BST Visualizer</h1>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setErrorMessage("");
            }}
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
          <button onClick={handleCalculateHeight} className={`${styles.button} ${styles.secondary}`}>
            Calcular altura
          </button>
        </div>

        {errorMessage ? (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        ) : null}

        {treeHeight !== null ? (
          <p className={styles.heightResult}>Altura del árbol: {treeHeight}</p>
        ) : null}

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
