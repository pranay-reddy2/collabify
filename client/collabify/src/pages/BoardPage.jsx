// src/pages/BoardPage.jsx
import React, { useState, useEffect, useRef, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { ReactSketchCanvas } from "react-sketch-canvas";
// --- Redux Imports ---
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoardById,
  saveCurrentBoard,
  addBlock,
  updateBlockValue,
  deleteBlock,
  updateBlockPosition,
  updateBlockSize,
  setDrawMode,
  setStrokeColor,
  setEraserMode,
  setCurrentBoardId,
} from "../redux/boardSlice";
// --- Icon Imports ---
import {
  FiSave,
  FiType,
  FiImage,
  FiTrash2,
  FiLoader,
  FiPenTool,
  FiRewind,
  FiMove,
  FiHome,
} from "react-icons/fi";
import { BsEraser } from "react-icons/bs";

// --- Pen Colors ---
const penColors = ["#E5E7EB", "#EF4444", "#3B82F6", "#22C55E"];

// --- TextBlock Component ---
const TextBlock = memo(
  ({
    block,
    updateBlockValue,
    deleteBlock,
    updateBlockPosition,
    updateBlockSize,
    isDrawing,
  }) => {
    const [size, setSize] = useState({
      width: block.width || 200,
      height: block.height || "auto",
    });
    const dragControls = useDragControls();
    const textareaRef = useRef(null);

    const adjustTextareaHeight = (element) => {
      if (element && size.height === "auto") {
        element.style.height = "auto";
        element.style.height = `${Math.max(element.scrollHeight, 40)}px`;
      }
    };

    useEffect(() => {
      adjustTextareaHeight(textareaRef.current);
    }, [block.value, size.height]);

    const handleResize = (e) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = textareaRef.current?.clientHeight || 40;
      const onMouseMove = (moveEvent) => {
        const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 150);
        const newHeight = Math.max(
          startHeight + moveEvent.clientY - startY,
          40
        );
        setSize({ width: newWidth, height: newHeight });
        if (textareaRef.current) {
          textareaRef.current.style.height = `${newHeight}px`;
        }
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        updateBlockSize(block.id, { width: size.width, height: size.height });
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    return (
      <motion.div
        layout
        drag={!isDrawing}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        onDragEnd={(e, info) => updateBlockPosition(block.id, info.point)}
        style={{
          position: "absolute",
          top: block.y,
          left: block.x,
          width: size.width,
          height: size.height === "auto" ? undefined : size.height,
          minHeight: 40,
        }}
        className={`relative z-20 rounded-lg transition-shadow duration-150 group ${
          isDrawing ? "pointer-events-none" : ""
        } ${
          !isDrawing
            ? "hover:bg-gray-800/50 hover:border hover:border-gray-700"
            : ""
        }`}
      >
        {!isDrawing && (
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              dragControls.start(e);
            }}
            className="absolute -left-6 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity duration-150 z-30"
            title="Drag"
          >
            <FiMove />
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={block.value}
          onChange={(e) => {
            updateBlockValue(block.id, e.target.value);
            if (size.height === "auto") adjustTextareaHeight(e.target);
          }}
          disabled={isDrawing}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full h-full p-2 bg-transparent text-gray-100 resize-none outline-none overflow-hidden rounded-lg"
          placeholder="Type here..."
          style={{ minHeight: "40px" }}
        />
        {!isDrawing && (
          <>
            <button
              onClick={() => deleteBlock(block.id)}
              className="absolute -top-3 -right-3 p-1 bg-gray-800 rounded-full text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30"
              title="Delete"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
            <div
              onMouseDown={handleResize}
              className="absolute bottom-0 right-0 w-4 h-4 bg-gray-700/50 hover:bg-gray-600 cursor-se-resize rounded-br-lg rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30"
              title="Resize"
            />
          </>
        )}
      </motion.div>
    );
  }
);

// --- ImageBlock Component ---
const ImageBlock = memo(
  ({ block, deleteBlock, updateBlockPosition, updateBlockSize, isDrawing }) => {
    const [size, setSize] = useState({ width: block.width || 200 });
    const dragControls = useDragControls();
    const imageRef = useRef(null);

    const handleResize = (e) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startWidth = size.width;

      const onMouseMove = (moveEvent) => {
        const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 100);
        setSize({ width: newWidth });
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        updateBlockSize(block.id, { width: size.width, height: "auto" });
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    return (
      <motion.div
        layout
        drag={!isDrawing}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        onDragEnd={(e, info) => updateBlockPosition(block.id, info.point)}
        style={{
          position: "absolute",
          top: block.y,
          left: block.x,
          width: size.width,
        }}
        className={`relative z-20 group ${
          isDrawing ? "pointer-events-none" : ""
        }`}
      >
        {!isDrawing && (
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              dragControls.start(e);
            }}
            className="absolute top-1 left-1 p-1 text-gray-200 bg-black/30 rounded-full cursor-grab active:cursor-grabbing touch-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            title="Drag"
          >
            <FiMove className="w-4 h-4" />
          </div>
        )}
        <img
          ref={imageRef}
          src={block.value}
          alt="Uploaded"
          className="w-full h-auto rounded-lg border border-gray-700 block select-none"
          draggable="false"
        />
        {!isDrawing && (
          <>
            <button
              onClick={() => deleteBlock(block.id)}
              className="absolute -top-3 -right-3 p-1 bg-gray-800 rounded-full text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30"
              title="Delete"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
            <div
              onMouseDown={handleResize}
              className="absolute bottom-0 right-0 w-4 h-4 bg-gray-700/50 hover:bg-gray-600 cursor-se-resize rounded-br-lg rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30"
              title="Resize"
            />
          </>
        )}
      </motion.div>
    );
  }
);

// --- Main BoardPage Component ---
const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Board ID from useParams:", id);

  // --- Select state from Redux ---
  const {
    boardName,
    content,
    status,
    error,
    isSaving,
    drawMode,
    strokeColor,
    isErasing,
  } = useSelector((state) => state.board);

  // Local state
  const [placingBlock, setPlacingBlock] = useState(null);
  const [clickCoords, setClickCoords] = useState(null);

  const fileInputRef = useRef(null);
  const sketchCanvas = useRef(null);

  // Fetch board data on mount
  useEffect(() => {
    if (!id) {
      console.error("No board ID found in URL");
      return;
    }

    console.log("Fetching board with ID:", id);
    dispatch(setCurrentBoardId(id));
    dispatch(fetchBoardById(id))
      .unwrap()
      .then((fetchedData) => {
        console.log("Board fetched successfully:", fetchedData);
        // Load drawing data into canvas
        if (
          fetchedData.data?.drawing?.length > 0 &&
          sketchCanvas.current?.loadPaths
        ) {
          setTimeout(() => {
            if (sketchCanvas.current?.loadPaths) {
              console.log("Loading drawing paths:", fetchedData.data.drawing);
              sketchCanvas.current.loadPaths(fetchedData.data.drawing);
            }
          }, 100);
        }
      })
      .catch((fetchError) => {
        console.error("Failed to fetch board:", fetchError);
      });
  }, [id, dispatch]);

  // --- Handlers ---
  const handleAddBlock = (type, value = "", x, y) => {
    const payload = {
      type,
      value,
      x,
      y,
      width: type === "text" ? 200 : 200,
      height: type === "text" ? "auto" : undefined,
    };
    dispatch(addBlock(payload));
  };

  const handleUpdateValue = (id, value) => {
    dispatch(updateBlockValue({ id, value }));
  };

  const handleDeleteBlock = (id) => {
    dispatch(deleteBlock(id));
  };

  const handleUpdatePosition = (id, point) => {
    dispatch(updateBlockPosition({ id, x: point.x, y: point.y }));
  };

  const handleUpdateSize = (id, size) => {
    dispatch(updateBlockSize({ id, width: size.width, height: size.height }));
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !clickCoords) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleAddBlock("image", reader.result, clickCoords.x, clickCoords.y);
    };
    reader.readAsDataURL(file);
    setClickCoords(null);
  };

  const handleBoardClick = (e) => {
    if (
      placingBlock &&
      !drawMode &&
      (e.target.id === "board-content-area" ||
        e.target === sketchCanvas.current?.canvas)
    ) {
      const x = e.clientX;
      const y = e.clientY;
      if (placingBlock === "text") handleAddBlock("text", "", x - 10, y - 10);
      if (placingBlock === "image") {
        setClickCoords({ x: x - 100, y: y - 50 });
        triggerImageUpload();
      }
      setPlacingBlock(null);
    }
  };

  const handleSaveBoard = async () => {
    if (!sketchCanvas.current || !id) return;
    try {
      const currentDrawingData = await sketchCanvas.current.exportPaths();
      console.log(
        "Saving board - blocks:",
        content.length,
        "drawing paths:",
        currentDrawingData.length
      );

      await dispatch(
        saveCurrentBoard({
          boardId: id,
          blocks: content,
          drawing: currentDrawingData,
        })
      ).unwrap();

      alert("Board saved!");
    } catch (saveError) {
      console.error("Failed to save board:", saveError);
      alert(`Failed to save board: ${saveError}`);
    }
  };

  const handleUndoDrawing = () => sketchCanvas.current?.undo();

  const handleToggleEraser = () => {
    dispatch(setEraserMode(!isErasing));
    sketchCanvas.current?.eraseMode(!isErasing);
  };

  const handleSetPenColor = (color) => {
    dispatch(setStrokeColor(color));
    if (sketchCanvas.current) sketchCanvas.current.eraseMode(false);
  };

  const handleToggleDrawMode = () => {
    dispatch(setDrawMode(!drawMode));
    if (drawMode) setPlacingBlock(null);
  };

  const handleStartPlacingBlock = (type) => {
    setPlacingBlock(type);
    if (drawMode) dispatch(setDrawMode(false));
  };

  // --- Render Logic ---
  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <FiLoader className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-400">
        <p className="text-xl mb-4">
          Error loading board: {error || "Unknown Error"}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      id="board-content-area"
      onClick={handleBoardClick}
      className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100 ${
        placingBlock
          ? "cursor-crosshair"
          : drawMode
          ? "cursor-crosshair"
          : "cursor-default"
      }`}
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl opacity-20 mix-blend-screen animate-pulse" />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-purple-700 rounded-full filter blur-3xl opacity-15 mix-blend-screen animate-pulse"
          style={{ animationDelay: "3.8s" }}
        />
      </div>

      {/* Drawing Canvas */}
      <ReactSketchCanvas
        ref={sketchCanvas}
        width="100%"
        height="100%"
        strokeColor={strokeColor}
        strokeWidth={4}
        readOnly={!drawMode}
        canvasColor="transparent"
        className={`absolute top-0 left-0 z-10 ${
          !drawMode ? "pointer-events-none" : ""
        }`}
      />

      {/* Header */}
      <header className="relative z-30 flex justify-between items-center px-6 md:px-12 pt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700 rounded-lg transition-colors group pointer-events-auto"
            title="Back to Dashboard"
          >
            <FiHome className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <h1 className="text-2xl font-bold pointer-events-auto">
            {boardName}
          </h1>
        </div>
      </header>

      {/* Board Content Area */}
      <div className="flex-1 relative w-full h-full pt-4">
        <AnimatePresence>
          {content.map((block) => {
            if (block.type === "text") {
              return (
                <TextBlock
                  key={block.id}
                  block={block}
                  updateBlockValue={handleUpdateValue}
                  deleteBlock={handleDeleteBlock}
                  updateBlockPosition={handleUpdatePosition}
                  updateBlockSize={handleUpdateSize}
                  isDrawing={drawMode}
                />
              );
            }
            if (block.type === "image") {
              return (
                <ImageBlock
                  key={block.id}
                  block={block}
                  deleteBlock={handleDeleteBlock}
                  updateBlockPosition={handleUpdatePosition}
                  updateBlockSize={handleUpdateSize}
                  isDrawing={drawMode}
                />
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-950/70 backdrop-blur-2xl border border-gray-800 p-3 rounded-full shadow-lg">
        <button
          onClick={handleSaveBoard}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            <FiSave className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button
          onClick={() => handleStartPlacingBlock("text")}
          className={`p-2.5 rounded-full transition-colors ${
            placingBlock === "text"
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-800"
          }`}
          title="Add Text"
        >
          <FiType className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleStartPlacingBlock("image")}
          className={`p-2.5 rounded-full transition-colors ${
            placingBlock === "image"
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-800"
          }`}
          title="Add Image"
        >
          <FiImage className="w-5 h-5" />
        </button>
        <button
          onClick={handleToggleDrawMode}
          className={`p-2.5 rounded-full transition-colors ${
            drawMode
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-800"
          }`}
          title={drawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
        >
          <FiPenTool className="w-5 h-5" />
        </button>
        {drawMode && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
            {penColors.map((color) => (
              <button
                key={color}
                onClick={() => handleSetPenColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  strokeColor === color && !isErasing
                    ? "border-white scale-110"
                    : "border-gray-700 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
            <button
              onClick={handleToggleEraser}
              className={`p-2.5 rounded-full transition-colors ${
                isErasing
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
              title="Toggle Eraser"
            >
              <BsEraser className="w-5 h-5" />
            </button>
            <button
              onClick={handleUndoDrawing}
              className="p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              title="Undo"
            >
              <FiRewind className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default BoardPage;
