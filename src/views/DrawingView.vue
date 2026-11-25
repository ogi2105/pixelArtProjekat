<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const rows = 64
const cols = 64

type Tool = 'pencil' | 'bucket' | 'eraser'

const activeTool = ref<Tool>('pencil')
const selectedColor = ref('#000000')
const showGrid = ref(true)

const grid = ref<string[][]>(Array.from({ length: rows }, () => Array(cols).fill('#ffffff')))

const isDrawing = ref(false)
const isSidebarOpen = ref(true)

const showContextMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })

// za otvaranje i zatvaranje alata
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
// za otvaranje alata na desni klik
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  menuPosition.value = { x: e.clientX, y: e.clientY }
  showContextMenu.value = true
}

const closeContextMenu = () => {
  showContextMenu.value = false
}

onMounted(() => {
  window.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeContextMenu)
})
// za odabir alata
const selectTool = (tool: Tool, closeMenu = false) => {
  activeTool.value = tool
  if (closeMenu) {
    showContextMenu.value = false
  }
}

const toggleGrid = (closeMenu = false) => {
  showGrid.value = !showGrid.value
  if (closeMenu) {
    showContextMenu.value = false
  }
}

const handleMouseDown = (r: number, c: number) => {
  isDrawing.value = true
  if (activeTool.value === 'bucket') {
    fillCanvas(r, c)
  } else {
    applyTool(r, c)
  }
}

const handleMouseOver = (r: number, c: number) => {
  if (isDrawing.value && activeTool.value !== 'bucket') {
    applyTool(r, c)
  }
}

const stopDrawing = () => {
  isDrawing.value = false
}

const applyTool = (r: number, c: number) => {
  if (!grid.value[r]) return
  if (activeTool.value === 'pencil') {
    grid.value[r][c] = selectedColor.value
  } else if (activeTool.value === 'eraser') {
    grid.value[r][c] = '#ffffff'
  }
}

const fillCanvas = (startR: number, startC: number) => {
  const targetColor = grid.value[startR][startC]
  const fillColor = selectedColor.value

  if (targetColor === fillColor) return

  const queue: [number, number][] = [[startR, startC]]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    const key = `${r},${c}`

    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      visited.has(key) ||
      grid.value[r][c] !== targetColor
    ) {
      continue
    }

    visited.add(key)
    grid.value[r][c] = fillColor

    queue.push([r + 1, c])
    queue.push([r - 1, c])
    queue.push([r, c + 1])
    queue.push([r, c - 1])
  }
}

const clearCanvas = (closeMenu = false) => {
  grid.value = Array.from({ length: rows }, () => Array(cols).fill('#ffffff'))
  if (closeMenu) {
    showContextMenu.value = false
  }
}
</script>

<template>
  <div
    class="drawing-page"
    @mouseup="stopDrawing"
    @mouseleave="stopDrawing"
    @contextmenu="handleContextMenu"
  >
    <!-- Fiksirani meni sa leve strane -->
    <div class="fixed-sidebar">
      <button
        class="toggle-btn"
        @click="toggleSidebar"
        :title="isSidebarOpen ? 'Zatvori meni' : 'Otvori alate'"
      >
        {{ isSidebarOpen ? '◀' : '▶' }}
      </button>

      <div class="sidebar-content" v-show="isSidebarOpen">
        <div class="menu-header">Alati</div>

        <div class="color-picker-wrapper" title="Izaberi boju">
          <input type="color" v-model="selectedColor" class="color-input" />
          <div class="color-preview" :style="{ backgroundColor: selectedColor }"></div>
        </div>

        <hr class="divider" />

        <button
          class="tool-btn"
          :class="{ active: activeTool === 'pencil' }"
          @click="selectTool('pencil')"
          title="Olovka"
        >
          ✏️
        </button>

        <button
          class="tool-btn"
          :class="{ active: activeTool === 'bucket' }"
          @click="selectTool('bucket')"
          title="Kantica"
        >
          🪣
        </button>

        <button
          class="tool-btn"
          :class="{ active: activeTool === 'eraser' }"
          @click="selectTool('eraser')"
          title="Gumica"
        >
          👝
        </button>

        <hr class="divider" />

        <button
          class="tool-btn"
          :class="{ active: !showGrid }"
          @click="toggleGrid(false)"
          :title="showGrid ? 'Isključi grid' : 'Uključi grid'"
        >
          🔲
        </button>

        <button class="tool-btn clear-btn" @click="clearCanvas(false)" title="Obriši sve">
          ❌
        </button>
      </div>
    </div>

    <!-- Kontekstni meni -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
      @click.stop
    >
      <div class="ctx-menu-header">Alati</div>

      <div class="ctx-color-wrapper" title="Izaberi boju">
        <input type="color" v-model="selectedColor" class="ctx-color-input" />
        <div class="ctx-color-preview" :style="{ backgroundColor: selectedColor }"></div>
      </div>

      <hr class="ctx-divider" />

      <button
        class="ctx-tool-btn"
        :class="{ active: activeTool === 'pencil' }"
        @click="selectTool('pencil', true)"
        title="Olovka"
      >
        ✏️
      </button>

      <button
        class="ctx-tool-btn"
        :class="{ active: activeTool === 'bucket' }"
        @click="selectTool('bucket', true)"
        title="Kantica"
      >
        🪣
      </button>

      <button
        class="ctx-tool-btn"
        :class="{ active: activeTool === 'eraser' }"
        @click="selectTool('eraser', true)"
        title="Gumica"
      >
        👝
      </button>

      <hr class="ctx-divider" />

      <button
        class="ctx-tool-btn"
        :class="{ active: !showGrid }"
        @click="toggleGrid(true)"
        :title="showGrid ? 'Isključi grid' : 'Uključi grid'"
      >
        🔲
      </button>

      <button class="ctx-tool-btn ctx-clear-btn" @click="clearCanvas(true)" title="Obriši sve">
        ❌
      </button>
    </div>

    <!-- Platno -->
    <div class="canvas-wrapper">
      <div
        class="grid"
        :class="{ 'no-grid': !showGrid }"
        :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }"
      >
        <template v-for="(row, rIndex) in grid" :key="rIndex">
          <div
            v-for="(color, cIndex) in row"
            :key="cIndex"
            class="pixel"
            :style="{ backgroundColor: color }"
            @mousedown.prevent="handleMouseDown(rIndex, cIndex)"
            @mouseover="handleMouseOver(rIndex, cIndex)"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawing-page {
  width: 100%;
  height: calc(100vh - 70px);
  position: relative;
  user-select: none;
  background-color: #f1f3f5;
  overflow: hidden;
  touch-action: none;
}

.fixed-sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  border-radius: 0 16px 16px 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  z-index: 999;
  border: 1px solid #dee2e6;
  border-left: none;
}

.sidebar-content {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.toggle-btn {
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-left: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #495057;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.toggle-btn:hover {
  background: #f8f9fa;
  color: #42b883;
}

/* KONTEKSTNI MENI */
.context-menu {
  position: fixed;
  z-index: 9999;
  background: #ffffff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 1px solid #dee2e6;
}

.ctx-menu-header {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #adb5bd;
  margin-bottom: -2px;
}

.ctx-divider {
  width: 80%;
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 2px 0;
}

.ctx-color-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  border: 2px solid #dee2e6;
  transition: transform 0.15s ease;
}

.ctx-color-wrapper:hover {
  transform: scale(1.08);
}

.ctx-color-input {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 60px;
  height: 60px;
  opacity: 0;
  cursor: pointer;
}

.ctx-color-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ctx-tool-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fa;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.ctx-tool-btn:hover {
  background-color: #e9ecef;
  transform: scale(1.08);
}

.ctx-tool-btn.active {
  background-color: #42b883;
  box-shadow: 0 3px 8px rgba(66, 184, 131, 0.4);
}

.ctx-clear-btn:hover {
  background-color: #ffe3e3;
}
/* KRAJ KONTEKSTNOG MENIJA */

.color-picker-wrapper {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  transition: transform 0.15s ease;
  border: 2px solid #dee2e6;
}

.color-picker-wrapper:hover {
  transform: scale(1.08);
}

.color-input {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 60px;
  height: 60px;
  opacity: 0;
  cursor: pointer;
}

.color-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.tool-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fa;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background-color: #e9ecef;
  transform: scale(1.08);
}

.tool-btn.active {
  background-color: #42b883;
  box-shadow: 0 3px 8px rgba(66, 184, 131, 0.4);
}

.clear-btn:hover {
  background-color: #ffe3e3;
}

.canvas-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  align-items: center;
  width: min(80vh, 80vw);
  height: min(80vh, 80vw);
}

.grid {
  display: grid;
  gap: 1px;
  background-color: #dee2e6;
  width: 100%;
  height: 100%;
}

.grid.no-grid {
  gap: 0;
  background-color: transparent;
}

.pixel {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  cursor: pointer;
}
</style>
