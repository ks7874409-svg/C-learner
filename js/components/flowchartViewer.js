// C-Forge: Interactive Flowchart Viewer Component (Enhanced)
// Node click navigation, adjustable auto-play speeds, and synchronized execution trace.

class FlowchartViewer {
  constructor(containerId, controlPanelId) {
    this.container = document.getElementById(containerId);
    this.controlPanel = document.getElementById(controlPanelId);
    this.currentFlowchart = null;
    this.currentStepIdx = 0;
    this.autoPlayTimer = null;
    this.playSpeed = 1600; // default 1.6s
  }

  loadFlowchart(flowchartId) {
    this.stopAutoPlay();
    this.currentFlowchart = FLOWCHARTS_DATA.find(fc => fc.id === flowchartId) || FLOWCHARTS_DATA[0];
    this.currentStepIdx = 0;
    this.render();
  }

  jumpToNode(nodeId) {
    if (!this.currentFlowchart || !this.currentFlowchart.steps) return;
    const stepIdx = this.currentFlowchart.steps.findIndex(s => s.activeNode === nodeId);
    if (stepIdx !== -1) {
      this.currentStepIdx = stepIdx;
      this.updateStepDisplay();
      if (window.soundFX) window.soundFX.playStep();
    }
  }

  nextStep() {
    if (!this.currentFlowchart || !this.currentFlowchart.steps) return;
    if (this.currentStepIdx < this.currentFlowchart.steps.length - 1) {
      this.currentStepIdx++;
      this.updateStepDisplay();
    } else {
      this.stopAutoPlay();
    }
  }

  prevStep() {
    if (!this.currentFlowchart || !this.currentFlowchart.steps) return;
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this.updateStepDisplay();
    }
  }

  reset() {
    this.stopAutoPlay();
    this.currentStepIdx = 0;
    this.updateStepDisplay();
  }

  setSpeed(ms) {
    this.playSpeed = ms;
    if (this.autoPlayTimer) {
      this.stopAutoPlay();
      this.toggleAutoPlay();
    }
  }

  toggleAutoPlay() {
    if (this.autoPlayTimer) {
      this.stopAutoPlay();
    } else {
      if (this.currentStepIdx >= this.currentFlowchart.steps.length - 1) {
        this.currentStepIdx = 0;
      }
      this.autoPlayTimer = setInterval(() => {
        if (this.currentStepIdx < this.currentFlowchart.steps.length - 1) {
          this.nextStep();
        } else {
          this.stopAutoPlay();
        }
      }, this.playSpeed);
      this.updateControlButtons();
    }
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
      this.updateControlButtons();
    }
  }

  render() {
    if (!this.container || !this.currentFlowchart) return;

    const fc = this.currentFlowchart;
    const currentStep = fc.steps ? fc.steps[this.currentStepIdx] : null;

    let html = `
      <div class="flowchart-viewer-wrap">
        <div class="flowchart-header">
          <div class="fc-titles">
            <h3><i class="fa-solid fa-diagram-project text-accent"></i> ${fc.title}</h3>
            <p class="fc-sub">${fc.subtitle}</p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="badge badge-accent">${fc.category}</span>
            <span class="node-click-hint"><i class="fa-solid fa-hand-pointer"></i> Click any node to inspect</span>
          </div>
        </div>

        <div class="flowchart-body-grid">
          <!-- NODES DIAGRAM COLUMN -->
          <div class="fc-diagram-col">
            <div class="fc-nodes-flow">
              ${fc.nodes.map((node, index) => {
                const isActive = currentStep && currentStep.activeNode === node.id;
                return `
                  <div class="fc-node-item ${node.type} ${isActive ? 'active-node' : ''}" 
                       id="fc_node_${node.id}"
                       onclick="window.flowchartViewer.jumpToNode('${node.id}')"
                       title="Click to jump to this node in tracer">
                    <div class="fc-node-box">
                      <div class="fc-node-badge">${node.type.toUpperCase()}</div>
                      <div class="fc-node-label">${node.label}</div>
                      <div class="fc-node-desc">${node.desc}</div>
                    </div>
                    ${index < fc.nodes.length - 1 ? `
                      <div class="fc-connector-arrow">
                        <i class="fa-solid fa-arrow-down"></i>
                        ${fc.connections && fc.connections[index] ? `<span class="conn-tag">${fc.connections[index].label || ''}</span>` : ''}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- STEP-BY-STEP TRACER PANEL -->
          <div class="fc-tracer-col">
            <div class="tracer-card">
              <div class="tracer-header">
                <span class="tracer-title"><i class="fa-solid fa-microchip text-accent"></i> Execution Tracer</span>
                <span class="tracer-progress" id="tracerProgress">Step ${this.currentStepIdx + 1} of ${fc.steps ? fc.steps.length : 0}</span>
              </div>

              <div class="tracer-body">
                <h4 class="step-title" id="tracerStepTitle">${currentStep ? currentStep.title : ''}</h4>
                <p class="step-explanation" id="tracerStepExp">${currentStep ? currentStep.explanation : ''}</p>
                
                <div class="tracer-code-block">
                  <div class="code-title"><i class="fa-solid fa-code"></i> Active Code State</div>
                  <pre><code id="tracerCodeSnippet">${currentStep ? this.escapeHtml(currentStep.codeSnippet) : ''}</code></pre>
                </div>

                <div class="tracer-status-box">
                  <span class="status-indicator"><i class="fa-solid fa-circle-dot"></i></span>
                  <span id="tracerStatusText">${currentStep ? currentStep.status : ''}</span>
                </div>
              </div>

              <!-- CONTROLS & SPEED ADJUSTER -->
              <div class="tracer-controls-wrapper">
                <div class="tracer-controls">
                  <button class="btn btn-secondary btn-sm" id="btnPrevStep" onclick="window.flowchartViewer.prevStep()">
                    <i class="fa-solid fa-backward-step"></i> Prev
                  </button>
                  <button class="btn btn-primary btn-sm" id="btnPlayStep" onclick="window.flowchartViewer.toggleAutoPlay()">
                    <i class="fa-solid fa-play"></i> Auto Play
                  </button>
                  <button class="btn btn-secondary btn-sm" id="btnNextStep" onclick="window.flowchartViewer.nextStep()">
                    Next <i class="fa-solid fa-forward-step"></i>
                  </button>
                  <button class="btn btn-ghost btn-sm" id="btnResetStep" onclick="window.flowchartViewer.reset()" title="Reset to Step 1">
                    <i class="fa-solid fa-rotate-left"></i>
                  </button>
                </div>

                <div class="speed-control-row">
                  <span>Speed:</span>
                  <button class="btn btn-xs ${this.playSpeed === 2400 ? 'btn-primary' : 'btn-ghost'}" onclick="window.flowchartViewer.setSpeed(2400)">0.5x</button>
                  <button class="btn btn-xs ${this.playSpeed === 1600 ? 'btn-primary' : 'btn-ghost'}" onclick="window.flowchartViewer.setSpeed(1600)">1x</button>
                  <button class="btn btn-xs ${this.playSpeed === 800 ? 'btn-primary' : 'btn-ghost'}" onclick="window.flowchartViewer.setSpeed(800)">2x</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.updateStepDisplay();
  }

  updateStepDisplay() {
    if (!this.currentFlowchart || !this.currentFlowchart.steps) return;
    const step = this.currentFlowchart.steps[this.currentStepIdx];
    if (!step) return;

    // Update active node styling
    this.currentFlowchart.nodes.forEach(n => {
      const el = document.getElementById(`fc_node_${n.id}`);
      if (el) {
        if (n.id === step.activeNode) {
          el.classList.add('active-node');
        } else {
          el.classList.remove('active-node');
        }
      }
    });

    const progEl = document.getElementById("tracerProgress");
    if (progEl) progEl.textContent = `Step ${this.currentStepIdx + 1} of ${this.currentFlowchart.steps.length}`;

    const titleEl = document.getElementById("tracerStepTitle");
    if (titleEl) titleEl.textContent = step.title;

    const expEl = document.getElementById("tracerStepExp");
    if (expEl) expEl.textContent = step.explanation;

    const codeEl = document.getElementById("tracerCodeSnippet");
    if (codeEl) codeEl.textContent = step.codeSnippet;

    const statusEl = document.getElementById("tracerStatusText");
    if (statusEl) statusEl.textContent = step.status;

    if (window.soundFX && window.soundFX.playStep) {
      window.soundFX.playStep();
    }
  }

  updateControlButtons() {
    const playBtn = document.getElementById("btnPlayStep");
    if (playBtn) {
      if (this.autoPlayTimer) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        playBtn.classList.add('btn-warning');
      } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Auto Play';
        playBtn.classList.remove('btn-warning');
      }
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

window.FlowchartViewer = FlowchartViewer;
