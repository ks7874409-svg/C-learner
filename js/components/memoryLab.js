// C-Forge: Interactive Memory & Pointer Lab Engine (Enhanced)
// Dynamic SVG Bezier pointer arrows, custom variable creation, direct cell mutation, and interactive heap traps.

class MemoryLab {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stackMemory = [];
    this.heapMemory = [];
    this.nextStackAddress = 0x7FFE20;
    this.nextHeapAddress = 0x55A010;
    this.currentPreset = "swap_comparison";
    this.svgCanvas = null;

    // Window resize handler to redraw arrows
    window.addEventListener("resize", () => {
      this.drawPointerArrows();
    });
  }

  init() {
    this.render();
    this.loadPreset("swap_comparison");
  }

  reset() {
    this.stackMemory = [];
    this.heapMemory = [];
    this.nextStackAddress = 0x7FFE20;
    this.nextHeapAddress = 0x55A010;
    this.render();
  }

  addStackVariable(name, type, value, isPointer = false, pointsTo = null) {
    let size = 4;
    if (type === 'char') size = 1;
    else if (type === 'double' || type === 'long long' || isPointer || type.includes('*')) size = 8;
    else if (type === 'short') size = 2;

    const address = "0x" + (this.nextStackAddress).toString(16).toUpperCase();
    this.nextStackAddress -= (size >= 4 ? size : 4);

    const item = {
      id: "var_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: name || "var",
      type: type || "int",
      size,
      value: value !== undefined ? value : "0",
      address,
      isPointer: isPointer || type.includes('*'),
      pointsTo,
      isDangling: false,
      isFreed: false,
      region: 'stack'
    };

    this.stackMemory.push(item);
    this.render();
    return item;
  }

  addHeapBlock(size = 4, value = "42", label = "malloc block") {
    const address = "0x" + (this.nextHeapAddress).toString(16).toUpperCase();
    this.nextHeapAddress += Math.max(16, size);

    const block = {
      id: "heap_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: label,
      type: `byte[${size}]`,
      size,
      value,
      address,
      isFreed: false,
      region: 'heap'
    };

    this.heapMemory.push(block);
    this.render();
    return block;
  }

  freeHeapBlock(address) {
    const block = this.heapMemory.find(b => b.address === address);
    if (!block) return false;
    block.isFreed = true;
    block.value = "DEALLOCATED / GARBAGE";

    // Mark any pointers targeting this address as dangling
    this.stackMemory.forEach(v => {
      if (v.isPointer && v.pointsTo === address) {
        v.isDangling = true;
      }
    });

    this.render();
    return true;
  }

  promptEditValue(itemAddress) {
    const stackItem = this.stackMemory.find(v => v.address === itemAddress);
    if (stackItem) {
      const newVal = prompt(`Edit value for '${stackItem.name}' (current: ${stackItem.value}):`, stackItem.value);
      if (newVal !== null && newVal.trim() !== "") {
        stackItem.value = newVal.trim();
        this.render();
        if (window.soundFX) window.soundFX.playStep();
      }
      return;
    }

    const heapItem = this.heapMemory.find(b => b.address === itemAddress);
    if (heapItem && !heapItem.isFreed) {
      const newVal = prompt(`Edit value inside Heap block at ${heapItem.address}:`, heapItem.value);
      if (newVal !== null && newVal.trim() !== "") {
        heapItem.value = newVal.trim();
        this.render();
        if (window.soundFX) window.soundFX.playStep();
      }
    }
  }

  promptDereferenceWrite(pointerAddress) {
    const ptr = this.stackMemory.find(v => v.address === pointerAddress && v.isPointer);
    if (!ptr) return;

    if (!ptr.pointsTo || ptr.pointsTo === "0x0" || ptr.pointsTo === "NULL") {
      alert("Segmentation Fault! Cannot dereference a NULL pointer.");
      if (window.soundFX) window.soundFX.playError();
      return;
    }

    if (ptr.isDangling) {
      alert("Undefined Behavior (Segmentation Fault)! Cannot dereference a Dangling Pointer targeting freed memory.");
      if (window.soundFX) window.soundFX.playError();
      return;
    }

    const targetVar = this.stackMemory.find(v => v.address === ptr.pointsTo);
    const targetHeap = this.heapMemory.find(b => b.address === ptr.pointsTo);
    const target = targetVar || targetHeap;

    if (!target) {
      alert(`Target address ${ptr.pointsTo} not found in active RAM.`);
      return;
    }

    const newVal = prompt(`Dereferencing *${ptr.name} (target: ${target.name} at ${ptr.pointsTo}). Enter new value:`, target.value);
    if (newVal !== null && newVal.trim() !== "") {
      target.value = newVal.trim();
      this.render();
      if (window.soundFX) window.soundFX.playSuccess();
    }
  }

  loadPreset(presetKey) {
    this.reset();
    this.currentPreset = presetKey;

    if (presetKey === "swap_comparison") {
      const x = this.addStackVariable("x", "int", "10");
      const y = this.addStackVariable("y", "int", "20");
      this.addStackVariable("ptrA", "int*", x.address, true, x.address);
      this.addStackVariable("ptrB", "int*", y.address, true, y.address);
      this.setScenarioDescription(
        "Pass-by-Reference in C",
        "Variables 'x' and 'y' reside at distinct stack addresses. Pointers 'ptrA' and 'ptrB' store their exact RAM addresses (notice the cyan arrows!). Click on 'ptrA' or 'ptrB' to dereference and mutate remotely!"
      );
    } else if (presetKey === "pointer_arithmetic") {
      const el0 = this.addStackVariable("arr[0]", "int", "100");
      const el1 = this.addStackVariable("arr[1]", "int", "200");
      const el2 = this.addStackVariable("arr[2]", "int", "300");
      this.addStackVariable("p", "int*", el0.address, true, el0.address);
      this.setScenarioDescription(
        "Pointer Arithmetic (p + 1)",
        "Notice how arr[0], arr[1], and arr[2] are laid out sequentially (4 bytes apart). Pointer 'p' starts pointing to arr[0]. Adding 1 to 'p' jumps by sizeof(int) (4 bytes), landing directly at arr[1]!"
      );
    } else if (presetKey === "dangling_pointer") {
      const heapBlock = this.addHeapBlock(4, "42", "malloc(4)");
      this.addStackVariable("heapPtr", "int*", heapBlock.address, true, heapBlock.address);
      this.setScenarioDescription(
        "Dangling Pointer Trap",
        "heapPtr points to a valid 4-byte chunk on the Heap. Click 'Simulate free()' above to release this block and watch heapPtr turn RED as a dangerous dangling pointer!"
      );
    } else if (presetKey === "double_pointer") {
      const val = this.addStackVariable("data", "int", "777");
      const p1 = this.addStackVariable("ptr", "int*", val.address, true, val.address);
      this.addStackVariable("ptr_to_ptr", "int**", p1.address, true, p1.address);
      this.setScenarioDescription(
        "Double Pointer Indirection (**pp)",
        "ptr_to_ptr points to ptr, which in turn points to data. Two levels of indirection traverse the memory addresses to reach value 777!"
      );
    }
  }

  setScenarioDescription(title, desc) {
    const el = document.getElementById("memLabDesc");
    if (el) {
      el.innerHTML = `<strong>${title}</strong>: ${desc}`;
    }
  }

  render() {
    if (!this.container) return;

    let html = `
      <div class="memory-lab-interactive-wrapper" style="position: relative;">
        <!-- SVG Canvas for Drawing Real Pointer Arrows -->
        <svg id="memLabSvgOverlay" class="memlab-svg-overlay"></svg>

        <div class="memory-lab-grid">
          <!-- STACK MEMORY REGION -->
          <div class="mem-region stack-region">
            <div class="mem-region-header">
              <span><i class="fa-solid fa-layer-group text-accent"></i> CALL STACK (Grows Downward)</span>
              <span class="badge badge-stack">High Memory $\to$ Low</span>
            </div>
            <div class="mem-cells-list" id="stackCellsList">
              ${this.stackMemory.length === 0 ? '<div class="empty-mem">Stack Frame is Empty. Use the creator toolbar below to add variables!</div>' : ''}
              ${this.stackMemory.map(v => this.renderMemoryCell(v)).join('')}
            </div>
          </div>

          <!-- HEAP MEMORY REGION -->
          <div class="mem-region heap-region">
            <div class="mem-region-header">
              <span><i class="fa-solid fa-cubes text-warning"></i> HEAP MEMORY (malloc / free)</span>
              <span class="badge badge-heap">Dynamic Allocations</span>
            </div>
            <div class="mem-cells-list" id="heapCellsList">
              ${this.heapMemory.length === 0 ? '<div class="empty-mem">Heap is clean (No active allocations)</div>' : ''}
              ${this.heapMemory.map(b => this.renderHeapBlock(b)).join('')}
            </div>
          </div>
        </div>

        <!-- USER-FRIENDLY INTERACTIVE VARIABLE ALLOCATOR TOOLBAR -->
        <div class="memlab-creator-toolbar">
          <div class="creator-header">
            <span><i class="fa-solid fa-plus-circle text-accent"></i> <strong>Interactive Variable Allocator</strong>: Create variables & watch RAM update instantly</span>
          </div>
          <div class="creator-controls-grid">
            <div class="creator-field">
              <label>Name:</label>
              <input type="text" id="allocVarName" placeholder="e.g. counter" value="my_var">
            </div>
            <div class="creator-field">
              <label>Type:</label>
              <select id="allocVarType" onchange="window.memoryLab.onTypeChange(this.value)">
                <option value="int">int (4 bytes)</option>
                <option value="char">char (1 byte)</option>
                <option value="double">double (8 bytes)</option>
                <option value="int*">int* Pointer (8 bytes)</option>
                <option value="char*">char* Pointer (8 bytes)</option>
              </select>
            </div>
            <div class="creator-field" id="allocValField">
              <label id="allocValLabel">Initial Value:</label>
              <input type="text" id="allocVarVal" placeholder="e.g. 42" value="42">
            </div>
            <div class="creator-field" id="allocTargetField" style="display: none;">
              <label>Points to Address:</label>
              <select id="allocPointsToSelect"></select>
            </div>
            <div class="creator-actions">
              <button class="btn btn-primary btn-sm" onclick="window.memoryLab.handleCreateVariable()">
                <i class="fa-solid fa-plus"></i> Allocate on Stack
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.memoryLab.handleCreateHeapBlock()">
                <i class="fa-solid fa-cube"></i> malloc(4) on Heap
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.populatePointerTargets();

    // Redraw SVG arrows after DOM paint
    setTimeout(() => {
      this.drawPointerArrows();
    }, 60);
  }

  onTypeChange(type) {
    const valField = document.getElementById("allocValField");
    const targetField = document.getElementById("allocTargetField");
    if (type.includes('*')) {
      if (valField) valField.style.display = "none";
      if (targetField) targetField.style.display = "flex";
      this.populatePointerTargets();
    } else {
      if (valField) valField.style.display = "flex";
      if (targetField) targetField.style.display = "none";
    }
  }

  populatePointerTargets() {
    const sel = document.getElementById("allocPointsToSelect");
    if (!sel) return;

    let options = '<option value="NULL">NULL (0x0)</option>';
    this.stackMemory.forEach(v => {
      options += `<option value="${v.address}">${v.name} (${v.address})</option>`;
    });
    this.heapMemory.forEach(b => {
      if (!b.isFreed) {
        options += `<option value="${b.address}">${b.name} (${b.address})</option>`;
      }
    });
    sel.innerHTML = options;
  }

  handleCreateVariable() {
    const nameEl = document.getElementById("allocVarName");
    const typeEl = document.getElementById("allocVarType");
    const valEl = document.getElementById("allocVarVal");
    const targetEl = document.getElementById("allocPointsToSelect");

    const name = nameEl ? nameEl.value.trim() || "x" : "x";
    const type = typeEl ? typeEl.value : "int";
    const isPtr = type.includes('*');
    const target = isPtr && targetEl ? targetEl.value : null;
    const val = isPtr ? target : (valEl ? valEl.value.trim() || "0" : "0");

    this.addStackVariable(name, type, val, isPtr, target);
    if (window.soundFX) window.soundFX.playSuccess();
  }

  handleCreateHeapBlock() {
    const block = this.addHeapBlock(4, "99", "malloc(4)");
    this.setScenarioDescription(
      "Heap Allocated!",
      `Allocated 4 bytes at heap address ${block.address}. Now create a pointer of type int* that points to this address!`
    );
    if (window.soundFX) window.soundFX.playSuccess();
  }

  renderMemoryCell(v) {
    const isPtr = v.isPointer;
    let arrowIndicator = '';
    let statusClass = '';

    if (isPtr) {
      if (v.isDangling) {
        statusClass = 'cell-dangling';
        arrowIndicator = `<span class="ptr-arrow-tag danger"><i class="fa-solid fa-triangle-exclamation"></i> DANGLING! Targets ${v.pointsTo}</span>`;
      } else if (v.pointsTo === "0x0" || v.value === "NULL" || v.pointsTo === null) {
        arrowIndicator = `<span class="ptr-arrow-tag"><i class="fa-solid fa-ban"></i> Points to NULL</span>`;
      } else {
        statusClass = 'cell-pointer';
        arrowIndicator = `<button class="btn btn-xs btn-outline" onclick="window.memoryLab.promptDereferenceWrite('${v.address}')" title="Click to dereference and mutate target">
          <i class="fa-solid fa-arrow-turn-down"></i> Deref *${v.name}
        </button>`;
      }
    }

    return `
      <div class="mem-cell ${statusClass}" id="cell_${v.address}" data-address="${v.address}">
        <div class="cell-addr">${v.address}</div>
        <div class="cell-meta">
          <span class="cell-type">${v.type}</span>
          <span class="cell-name"><strong>${v.name}</strong></span>
          <span class="cell-size">${v.size} bytes</span>
        </div>
        <div class="cell-value">
          <span class="val-display" onclick="window.memoryLab.promptEditValue('${v.address}')" title="Click to edit value">
            ${v.value} <i class="fa-solid fa-pencil edit-hint"></i>
          </span>
          ${arrowIndicator}
        </div>
      </div>
    `;
  }

  renderHeapBlock(b) {
    return `
      <div class="mem-cell heap-cell ${b.isFreed ? 'cell-freed' : 'cell-allocated'}" id="cell_${b.address}" data-address="${b.address}">
        <div class="cell-addr">${b.address}</div>
        <div class="cell-meta">
          <span class="cell-type">${b.type}</span>
          <span class="cell-name">${b.name}</span>
          <span class="cell-size">${b.size} bytes</span>
        </div>
        <div class="cell-value">
          <span class="val-display" ${!b.isFreed ? `onclick="window.memoryLab.promptEditValue('${b.address}')" title="Click to edit value"` : ''}>
            ${b.value} ${!b.isFreed ? '<i class="fa-solid fa-pencil edit-hint"></i>' : ''}
          </span>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span class="heap-status-tag ${b.isFreed ? 'freed' : 'active'}">
              ${b.isFreed ? '<i class="fa-solid fa-trash"></i> FREED' : '<i class="fa-solid fa-check"></i> ACTIVE'}
            </span>
            ${!b.isFreed ? `
              <button class="btn btn-xs btn-danger" onclick="window.memoryLab.freeHeapBlock('${b.address}')" title="Call free() on this block">
                free()
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  drawPointerArrows() {
    const svg = document.getElementById("memLabSvgOverlay");
    if (!svg) return;

    svg.innerHTML = `
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#06b6d4" />
        </marker>
        <marker id="arrowhead-danger" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#f43f5e" />
        </marker>
      </defs>
    `;

    const wrapper = svg.closest(".memory-lab-interactive-wrapper");
    if (!wrapper) return;
    const wrapRect = wrapper.getBoundingClientRect();

    svg.setAttribute("width", wrapRect.width);
    svg.setAttribute("height", wrapRect.height);

    this.stackMemory.forEach(v => {
      if (v.isPointer && v.pointsTo && v.pointsTo !== "0x0" && v.pointsTo !== "NULL") {
        const sourceCell = document.getElementById(`cell_${v.address}`);
        const targetCell = document.getElementById(`cell_${v.pointsTo}`);

        if (sourceCell && targetCell) {
          const sRect = sourceCell.getBoundingClientRect();
          const tRect = targetCell.getBoundingClientRect();

          const x1 = sRect.right - wrapRect.left - 10;
          const y1 = sRect.top + sRect.height / 2 - wrapRect.top;

          const x2 = tRect.left - wrapRect.left + 8;
          const y2 = tRect.top + tRect.height / 2 - wrapRect.top;

          const dx = Math.abs(x2 - x1);
          const cx1 = x1 + Math.max(30, dx * 0.4);
          const cy1 = y1;
          const cx2 = x2 - Math.max(30, dx * 0.4);
          const cy2 = y2;

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", v.isDangling ? "#f43f5e" : "#06b6d4");
          path.setAttribute("stroke-width", "2.5");
          path.setAttribute("stroke-dasharray", v.isDangling ? "4,4" : "none");
          path.setAttribute("marker-end", v.isDangling ? "url(#arrowhead-danger)" : "url(#arrowhead)");
          path.setAttribute("class", "animated-pointer-svg-path");

          svg.appendChild(path);
        }
      }
    });
  }
}

window.MemoryLab = MemoryLab;
