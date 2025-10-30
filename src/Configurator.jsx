import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const CANVAS_W = 2133;
const CANVAS_H = 4000;

const pickupOptions = {
  none: { label: "No Pickup", image: null },
  emg81: { label: "EMG 81", image: "/images/bridge-pickup-emg81.png" },
  emg85: { label: "EMG 85", image: "/images/bridge-pickup-emg85.png" },
  chrome: { label: "Chrome", image: "/images/bridge-pickup-chrome.png" },
  gold: { label: "Gold", image: "/images/bridge-pickup-gold.png" },
  black: { label: "Black", image: "/images/bridge-pickup-black.png" },
  white: { label: "White", image: "/images/bridge-pickup-white.png" },
  creme: { label: "Creme", image: "/images/bridge-pickup-creme.png" },
  zebra: { label: "Zebra", image: "/images/bridge-pickup-zebra.png" },
};

const bodyTextureOptions = {
  solid: null,
  plain: "/images/body-texture-plain.png",
  quilt: "/images/body-texture-quilt.png",
  flamed: "/images/body-texture-flamed.png",
};

const headstockTextureOptions = {
  solid: null,
  plain: "/images/headstock-texture-plain.png",
  quilt: "/images/headstock-texture-quilt.png",
  flamed: "/images/headstock-texture-flamed.png",
};

const inlayOptions = {
  none: null,
  largeDiamondsMOP: "/images/inlays-large-diamonds-mop.png",
  largeDiamondsBlack: "/images/inlays-large-diamonds-black.png",
};

const headstockOptions = {
  widow: { label: "Widow", image: "/images/headstock-widow.png" },
  beast: { label: "Beast", image: "/images/headstock-beast.png" },
  asm: { label: "ASM", image: "/images/headstock-asm.png" },
  "asm-reverse": { label: "ASM Reverse", image: "/images/headstock-asm-reverse.png" },
  pointy: { label: "Pointy", image: "/images/headstock-pointy.png" },
  "pointy-reverse": { label: "Pointy Reverse", image: "/images/headstock-pointy-reverse.png" },
  curved: { label: "Curved", image: "/images/headstock-curved.png" },
  "curved-reverse": { label: "Curved Reverse", image: "/images/headstock-curved-reverse.png" },
};

const fretboardOptions = {
  ebony: { label: "Ebony", image: "/images/ebony-fretboard.png" },
  maple: { label: "Maple", image: "/images/maple-fretboard.png" },
  rosewood: { label: "Rosewood", image: "/images/rosewood-fretboard.png" },
  roasted: { label: "Roasted Flamed Maple", image: "/images/roasted-flamed-maple-fretboard.png" },
};

const logoOptions = {
  rwhite: { label: "R White" },
  rblack: { label: "R Black" },
  swhite: { label: "Script White" },
  sblack: { label: "Script Black" },
};

const controlsOptions = {
  v: { chrome: "/images/controls-v-chrome.png", gold: "/images/controls-v-gold.png", black: "/images/controls-v-black.png" },
  vs: { chrome: "/images/controls-vs-chrome.png", gold: "/images/controls-vs-gold.png", black: "/images/controls-vs-black.png" },
  vst: { chrome: "/images/controls-vst-chrome.png", gold: "/images/controls-vst-gold.png", black: "/images/controls-vst-black.png" },
};

const tuningPegOptions = { chrome: "Chrome", gold: "Gold", black: "Black" };


function GuitarCanvas({ cfg, scale, onActivate, isActive, panelRef }) {
  return (
    <div className={`panel ${isActive ? "panel-active" : ""}`} onClick={onActivate}>
      <div
        className="scale-outer"
        style={{ width: `${Math.round(CANVAS_W * scale)}px`, height: `${Math.round(CANVAS_H * scale)}px` }}
      >
        <div className="scale-inner" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <div ref={panelRef} className="body-container" style={{ position: "relative", width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}>
            <div className="color-layer color-body" style={{ backgroundColor: cfg.bodyColor }} />
            <img src="/images/body-flat.png" alt="Body mask" />
            {cfg.bodyBurst && (
              <div
                className="color-layer color-body-burst"
                style={{
                  backgroundColor: cfg.bodyBurstColor,
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  WebkitMaskImage: "url(/images/body-burst.png)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskImage: "url(/images/body-burst.png)",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
            )}
            {cfg.bodyTexture !== "solid" && (
              <img
                src={bodyTextureOptions[cfg.bodyTexture]}
                alt="Body Texture"
                style={{ mixBlendMode: "multiply", opacity: 0.7 }}
              />
            )}
            {cfg.bodyStyle === "beveled" && <img src="/images/body-beveled.png" alt="Body Bevel" />}
            {cfg.stringers && <img src="/images/stringers.png" alt="Stringers" />}
            {cfg.bodyBinding && (
              <div
                className="color-layer color-body-binding"
                style={{
                  backgroundColor: cfg.bodyBindingColor,
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  WebkitMaskImage: "url(/images/body-binding.png)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskImage: "url(/images/body-binding.png)",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
            )}
            <div
              className="color-layer color-headstock"
              style={{
                backgroundColor: cfg.headstockMatches ? cfg.bodyColor : cfg.headstockColor,
                width: `${CANVAS_W}px`,
                height: `${CANVAS_H}px`,
                position: "absolute",
                top: 0,
                left: 0,
                WebkitMaskImage: `url(/images/${cfg.headstockStyle}-headstock-alpha.png)`,
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                WebkitMaskSize: "contain",
                maskImage: `url(/images/${cfg.headstockStyle}-headstock-alpha.png)`,
                maskRepeat: "no-repeat",
                maskPosition: "center",
                maskSize: "contain",
              }}
            />
            {cfg.headstockBurst && (
              <div
                className="color-layer color-headstock-burst"
                style={{
                  backgroundColor: cfg.headstockBurstColor,
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  WebkitMaskImage: `url(/images/${cfg.headstockStyle}-headstock-burst.png)`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskImage: `url(/images/${cfg.headstockStyle}-headstock-burst.png)`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
            )}
            {(cfg.headstockMatches ? cfg.bodyTexture : cfg.headstockTexture) !== "solid" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  WebkitMaskImage: `url(/images/${cfg.headstockStyle}-headstock-alpha.png)`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                  WebkitMaskMode: "alpha",
                  maskImage: `url(/images/${cfg.headstockStyle}-headstock-alpha.png)`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                  maskMode: "alpha",
                  pointerEvents: "none",
                }}
              >
                <img
                  src={headstockTextureOptions[cfg.headstockMatches ? cfg.bodyTexture : cfg.headstockTexture]}
                  alt="Headstock Texture"
                  style={{ mixBlendMode: "multiply", opacity: 0.7 }}
                />
              </div>
            )}
            <img src={headstockOptions[cfg.headstockStyle].image} alt="Headstock overlay" />
            {cfg.headstockBinding && (
              <div
                className="color-layer color-headstock-binding"
                style={{
                  backgroundColor: cfg.headstockBindingColor,
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  WebkitMaskImage: `url(/images/${cfg.headstockStyle}-headstock-binding.png)`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                  WebkitMaskComposite: "destination-in",
                  maskImage: `url(/images/${cfg.headstockStyle}-headstock-binding.png)`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                  maskComposite: "intersect",
                }}
              />
            )}
            <img src={`/images/${cfg.headstockStyle}-logo-${cfg.logo}.png`} alt="Headstock Logo" />
            <img src={`/images/${cfg.headstockStyle}-pegs-${cfg.tuningPegColor}.png`} alt="Tuning Pegs" />
            <img src={`/images/${cfg.headstockStyle}-tuners-${cfg.tuningPegColor}.png`} alt="Tuning Pegs" />
            <img src={fretboardOptions[cfg.fretboardStyle].image} alt="Fretboard overlay" />
            {cfg.fretboardBinding && (
              <div
                className="color-layer color-fretboard-binding"
                style={{
                  backgroundColor: cfg.fretboardBindingColor,
                  width: `${CANVAS_W}px`,
                  height: `${CANVAS_H}px`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  WebkitMaskImage: "url(/images/fretboard-binding.png)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskImage: "url(/images/fretboard-binding.png)",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
            )}
            {cfg.inlayStyle !== "none" && <img src={inlayOptions[cfg.inlayStyle]} alt="Inlays" />}
            {cfg.bridgePickup !== "none" && (
              <img
                src={pickupOptions[cfg.bridgePickup].image}
                alt="Bridge Pickup"
                style={{
                  transform:
                    (cfg.middlePickup === "none" ? "translateY(-30px)" : "") +
                    (cfg.bridgePickupAngle === "slanted" ? " translateX(-1px) translateY(-30px) rotate(13deg)" : ""),
                  transformOrigin: `${950}px ${2816}px`,
                }}
              />
            )}
            {cfg.middlePickup !== "none" && <img src={`/images/middle-pickup-${cfg.middlePickup}.png`} alt="Middle Pickup" />}
            {cfg.neckPickup !== "none" && <img src={`/images/neck-pickup-${cfg.neckPickup}.png`} alt="Neck Pickup" />}
            {cfg.controls && <img src={controlsOptions[cfg.controls][cfg.controlsStyle]} alt="Controls" />}
            <img src="/images/strings.png" alt="Strings" />
            {cfg.bridge && <img src={`/images/bridge-${cfg.bridge.toLowerCase().replace(" ", "-")}.png`} alt={cfg.bridge} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Configurator() {
  const defaultConfig = {
    bodyStyle: "beveled",
    headstockStyle: "asm",
    fretboardStyle: "ebony",
    bodyColor: "#34027aff",
    headstockMatches: true,
    headstockColor: "#34027aff",
    bodyBinding: false,
    bodyBindingColor: "#ffffff",
    fretboardBinding: false,
    fretboardBindingColor: "#ffffff",
    headstockBinding: false,
    headstockBindingColor: "#ffffff",
    inlayStyle: "none",
    bodyBurst: true,
    bodyBurstColor: "#000000",
    headstockBurst: true,
    headstockBurstColor: "#000000",
    logo: "swhite",
    bodyTexture: "quilt",
    headstockTexture: "quilt",
    bridgePickupAngle: "default",
    bridge: "Floyd Chrome",
    controls: "vst",
    controlsStyle: "chrome",
    tuningPegColor: "chrome",
    bridgePickup: "chrome",
    middlePickup: "none",
    neckPickup: "chrome",
    stringers: false,
  };

  const [configs, setConfigs] = useState([
    { ...defaultConfig, _label: "Panel A" },
    { ...defaultConfig, bodyColor: "#0b5e2aff", _label: "Panel B" },
  ]);
  const [activePanel, setActivePanel] = useState(0);
  const previewAreaRef = useRef(null);
  const panelRefs = [useRef(null), useRef(null)];
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function computeScale() {
      const area = previewAreaRef.current;
      if (!area) return;
      const padding = 20;
      const gap = 20;
      const availableW = area.clientWidth - padding;
      const availableH = area.clientHeight - padding;
      const wScale = availableW > 0 ? availableW / (CANVAS_W * 2 + gap) : 0.3;
      const hScale = availableH > 0 ? availableH / CANVAS_H : 0.3;
      const newScale = Math.min(wScale, hScale, 0.5);
      setScale(newScale > 0.2 ? newScale : 0.2);
      console.log({ availableW, availableH, wScale, hScale, newScale }); // Debug
    }
    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

  function updateActiveConfig(patch) {
    setConfigs((prev) =>
      prev.map((c, i) =>
        i === activePanel
          ? {
              ...c,
              ...patch,
              bodyBinding: patch.bodyStyle === "beveled" ? false : patch.bodyBinding ?? c.bodyBinding,
            }
          : c
      )
    );
  }

  // Rest of Configurator.jsx remains unchanged
  // ...
  // Rest of the component remains unchanged
  // ...

  //function randomizeConfig() {
    // const colors = ['chrome', 'gold', 'black'];
    // const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    
    //const randomConfig = {
    //  bodyStyle: Math.random() < 0.5 ? 'flat' : 'beveled',
    //  headstockStyle: Object.keys(headstockOptions)[Math.floor(Math.random() * Object.keys(headstockOptions).length)],
    //  fretboardStyle: Object.keys(fretboardOptions)[Math.floor(Math.random() * Object.keys(fretboardOptions).length)],
    //  bodyColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  headstockMatches: Math.random() < 0.7, // 70% chance to match body
    //  headstockColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  bodyBinding: Math.random() < 0.3,
    //  bodyBindingColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  fretboardBinding: Math.random() < 0.3,
    //  fretboardBindingColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  headstockBinding: Math.random() < 0.3,
    //  headstockBindingColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  inlayStyle: Object.keys(inlayOptions)[Math.floor(Math.random() * Object.keys(inlayOptions).length)],
    //  bodyBurst: Math.random() < 0.5,
    //  bodyBurstColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  headstockBurst: Math.random() < 0.5,
    //  headstockBurstColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}ff`,
    //  logo: Object.keys(logoOptions)[Math.floor(Math.random() * Object.keys(logoOptions).length)],
    //  bodyTexture: Object.keys(bodyTextureOptions)[Math.floor(Math.random() * Object.keys(bodyTextureOptions).length)],
    //  headstockTexture: Object.keys(headstockTextureOptions)[Math.floor(Math.random() * Object.keys(headstockTextureOptions).length)],
    //  bridgePickupAngle: Math.random() < 0.5 ? 'default' : 'slanted',
      
      // Ensure color consistency for hardware
    //   bridge: `Floyd ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`,
    //  controls: Object.keys(controlsOptions)[Math.floor(Math.random() * Object.keys(controlsOptions).length)],
    //  controlsStyle: selectedColor,
    //  tuningPegColor: selectedColor,
      
    //  middlePickup: Object.keys(pickupOptions)[Math.floor(Math.random() * Object.keys(pickupOptions).length)],
    //  neckPickup: Object.keys(pickupOptions)[Math.floor(Math.random() * Object.keys(pickupOptions).length)],
    //  stringers: Math.random() < 0.3,
    //};

    // Handle bridge naming for wraparound
    //if (Math.random() < 0.3) {
    //  randomConfig.bridge = `Wraparound ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`;
    //}

    //updateActiveConfig(randomConfig);
  //}

  async function downloadPNG() {
    try {
      // Create a high-resolution canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = CANVAS_W * 2; // 2x resolution
      canvas.height = CANVAS_H * 2;
      
      // Set background to transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cfg = configs[activePanel];
      
      // Helper function to load and draw image
      const drawImage = async (src, x = 0, y = 0, width = canvas.width, height = canvas.height, blendMode = 'source-over') => {
        if (!src) return;
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.globalCompositeOperation = blendMode;
            ctx.drawImage(img, x, y, width, height);
            resolve();
          };
          img.onerror = () => resolve(); // Skip if image fails to load
          img.src = src;
        });
      };
      
      // Helper function to apply mask and draw colored layer
      const drawMaskedColor = async (maskSrc, color, x = 0, y = 0, width = canvas.width, height = canvas.height) => {
        if (!maskSrc) return;
        return new Promise((resolve) => {
          const mask = new Image();
          mask.crossOrigin = 'anonymous';
          mask.onload = () => {
            // Create temporary canvas for mask
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            
            // Fill with color
            tempCtx.fillStyle = color;
            tempCtx.fillRect(0, 0, width, height);
            
            // Apply mask
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(mask, x, y, width, height);
            
            // Draw to main canvas
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(tempCanvas, x, y, width, height);
            resolve();
          };
          mask.onerror = () => resolve();
          mask.src = maskSrc;
        });
      };

      // Helper function to apply burst effect (pure transparency)
      const drawBurst = async (maskSrc, burstColor, x = 0, y = 0, width = canvas.width, height = canvas.height) => {
        if (!maskSrc) return;
        return new Promise((resolve) => {
          const mask = new Image();
          mask.crossOrigin = 'anonymous';
          mask.onload = () => {
            // Create temporary canvas for burst effect
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = width;
            tempCanvas.height = height;
            
            // Fill with burst color
            tempCtx.fillStyle = burstColor;
            tempCtx.fillRect(0, 0, width, height);
            
            // Apply burst mask as transparency (destination-in creates the transparency effect)
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(mask, x, y, width, height);
            
            // Draw to main canvas with multiply blend for realistic burst effect
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(tempCanvas, x, y, width, height);
            resolve();
          };
          mask.onerror = () => resolve();
          mask.src = maskSrc;
        });
      };
      
      // Layer 1: Body color - fill entire canvas with body color first
      ctx.fillStyle = cfg.bodyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Layer 1.5: Body flat overlay (explicit image, as-is with inherent shading)
      await drawImage('/images/body-flat.png');
      
      // Layer 2: Body burst (if enabled) - pure transparency effect
      if (cfg.bodyBurst) {
        await drawBurst('/images/body-burst.png', cfg.bodyBurstColor);
      }
      
      // Layer 3: Body texture (if not solid)
      if (cfg.bodyTexture !== 'solid') {
        await drawImage(bodyTextureOptions[cfg.bodyTexture], 0, 0, canvas.width, canvas.height, 'multiply');
      }
      
      // Layer 4: Bevel (if beveled)
      if (cfg.bodyStyle === 'beveled') {
        await drawImage('/images/body-beveled.png');
      }
      
      // Layer 5: Stringers (if enabled)
      if (cfg.stringers) {
        await drawImage('/images/stringers.png');
      }
      
      // Layer 6: Body binding (if enabled and not beveled)
      if (cfg.bodyBinding && cfg.bodyStyle !== 'beveled') {
        await drawMaskedColor('/images/body-binding.png', cfg.bodyBindingColor);
      }
      
      // Layer 7: Headstock color
      await drawMaskedColor(`/images/${cfg.headstockStyle}-headstock-alpha.png`, cfg.headstockMatches ? cfg.bodyColor : cfg.headstockColor);
      
      // Layer 8: Headstock burst (if enabled) - pure transparency effect
      if (cfg.headstockBurst) {
        await drawBurst(`/images/${cfg.headstockStyle}-headstock-burst.png`, cfg.headstockBurstColor);
      }
      
      // Layer 9: Headstock texture (if not solid)
    if ((cfg.headstockMatches ? cfg.bodyTexture : cfg.headstockTexture) !== 'solid') {
        const textureKey = cfg.headstockMatches ? cfg.bodyTexture : cfg.headstockTexture;
        const textureSrc = headstockTextureOptions[textureKey];
        if (textureSrc) {
        await new Promise((resolve) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
    
            const textureImg = new Image();
            const maskImg = new Image();
            let textureLoaded = false;
            let maskLoaded = false;
    
            const tryDraw = () => {
            if (!textureLoaded || !maskLoaded) return;
    
            // Draw texture onto temp canvas
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.drawImage(textureImg, 0, 0, tempCanvas.width, tempCanvas.height);
    
            // Apply headstock mask to the temp canvas
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(maskImg, 0, 0, tempCanvas.width, tempCanvas.height);
    
            // Draw masked texture onto main canvas using multiply + opacity (match CSS mixBlendMode + opacity)
            ctx.globalAlpha = 0.7;
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
    
            resolve();
            };
    
            textureImg.crossOrigin = 'anonymous';
            maskImg.crossOrigin = 'anonymous';
            textureImg.onload = () => { textureLoaded = true; tryDraw(); };
            maskImg.onload = () => { maskLoaded = true; tryDraw(); };
            textureImg.onerror = () => resolve();
            maskImg.onerror = () => resolve();
    
            textureImg.src = textureSrc;
            maskImg.src = `/images/${cfg.headstockStyle}-headstock-alpha.png`;
        });
        }
    }
  
      
      // Layer 10: Headstock overlay
      await drawImage(headstockOptions[cfg.headstockStyle].image);
      
      // Layer 11: Headstock binding (if enabled)
      if (cfg.headstockBinding) {
        await drawMaskedColor(`/images/${cfg.headstockStyle}-headstock-binding.png`, cfg.headstockBindingColor);
      }
      
      // Layer 12: Headstock logo
      await drawImage(`/images/${cfg.headstockStyle}-logo-${cfg.logo}.png`);
      
      // Layer 13: Tuning pegs
      await drawImage(`/images/${cfg.headstockStyle}-pegs-${cfg.tuningPegColor}.png`);
      await drawImage(`/images/${cfg.headstockStyle}-tuners-${cfg.tuningPegColor}.png`);
      
      // Layer 14: Fretboard
      await drawImage(fretboardOptions[cfg.fretboardStyle].image);
      
      // Layer 15: Fretboard binding (if enabled)
      if (cfg.fretboardBinding) {
        await drawMaskedColor('/images/fretboard-binding.png', cfg.fretboardBindingColor);
      }
      
      // Layer 16: Inlays (if not none)
      if (cfg.inlayStyle !== 'none') {
        await drawImage(inlayOptions[cfg.inlayStyle]);
      }
      
      // Layer 17: Bridge pickup (if not none)
      if (cfg.bridgePickup !== 'none') {
        await new Promise((resolve) => {
          const pickupImg = new Image();
          pickupImg.crossOrigin = 'anonymous';
          pickupImg.onload = () => {
            ctx.save();
            if (cfg.middlePickup === 'none') {
              ctx.translate(950 * 2, 2816 * 2);
              ctx.translate(0, -30 * 2);
              if (cfg.bridgePickupAngle === 'slanted') {
                ctx.translate(-1 * 2, -30 * 2);
                ctx.rotate(13 * Math.PI / 180);
              }
              ctx.drawImage(pickupImg, -950 * 2, -2816 * 2, canvas.width, canvas.height);
            } else {
              ctx.drawImage(pickupImg, 0, 0, canvas.width, canvas.height);
            }
            ctx.restore();
            resolve();
          };
          pickupImg.onerror = () => resolve();
          pickupImg.src = pickupOptions[cfg.bridgePickup].image;
        });
      }
      
      // Layer 18: Middle pickup (if not none)
      if (cfg.middlePickup !== 'none') {
        await drawImage(`/images/middle-pickup-${cfg.middlePickup}.png`);
      }
      
      // Layer 19: Neck pickup (if not none)
      if (cfg.neckPickup !== 'none') {
        await drawImage(`/images/neck-pickup-${cfg.neckPickup}.png`);
      }
      
      // Layer 20: Controls (if enabled)
      if (cfg.controls) {
        await drawImage(controlsOptions[cfg.controls][cfg.controlsStyle]);
      }
      
      // Layer 21: Strings
      await drawImage('/images/strings.png');
      
      // Layer 22: Bridge
      if (cfg.bridge) {
        await drawImage(`/images/bridge-${cfg.bridge.toLowerCase().replace(' ', '-')}.png`);
      }
      
      // Download the canvas as PNG
      const link = document.createElement('a');
      link.download = `guitar-config-${configs[activePanel]._label.toLowerCase().replace(' ', '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('Failed to generate PNG:', error);
      alert('Failed to download PNG. Please try again.');
    }
  }

  const cfg = configs[activePanel];

  return (
    <div className="app-root">
      <div className="topbar">
        <div className="brand">BC Rich Ignitor Configurator</div>
        <a className="coffee-link" href="https://buymeacoffee.com/cultoftheignitor" target="_blank" rel="noreferrer">Buy me a coffee ☕</a>
      </div>
      <div className="container">
        <div className="sidebar">
          <h1>{cfg._label}</h1>

          <label>Body Style</label>
          <select value={cfg.bodyStyle} onChange={(e) => updateActiveConfig({ bodyStyle: e.target.value })}>
            <option value="flat">Flat-top</option>
            <option value="beveled">Beveled</option>
          </select>

          <label>Headstock Style</label>
          <select value={cfg.headstockStyle} onChange={(e) => updateActiveConfig({ headstockStyle: e.target.value })}>
            {Object.entries(headstockOptions).map(([key, { label }]) => (
              <option value={key} key={key}>{label}</option>
            ))}
          </select>

          <label>Fretboard Style</label>
          <select value={cfg.fretboardStyle} onChange={(e) => updateActiveConfig({ fretboardStyle: e.target.value })}>
            {Object.entries(fretboardOptions).map(([key, { label }]) => (
              <option value={key} key={key}>{label}</option>
            ))}
          </select>

          <label>Logo</label>
          <select value={cfg.logo} onChange={(e) => updateActiveConfig({ logo: e.target.value })}>
            {Object.entries(logoOptions).map(([key, { label }]) => (
              <option value={key} key={key}>{label}</option>
            ))}
          </select>

          <label>Inlay Style</label>
          <select value={cfg.inlayStyle} onChange={(e) => updateActiveConfig({ inlayStyle: e.target.value })}>
            <option value="none">No Inlays</option>
            <option value="largeDiamondsMOP">Large Diamonds MOP</option>
            <option value="largeDiamondsBlack">Large Diamonds Black</option>
          </select>

          <label>Body Color</label>
          <input type="color" value={cfg.bodyColor} onChange={(e) => updateActiveConfig({ bodyColor: e.target.value })} />

          <label>Body Texture</label>
          <select value={cfg.bodyTexture} onChange={(e) => updateActiveConfig({ bodyTexture: e.target.value })}>
            <option value="solid">Solid</option>
            <option value="plain">Plain</option>
            <option value="quilt">Quilt</option>
            <option value="flamed">Flamed</option>
          </select>

          <label>
            <input type="checkbox" checked={cfg.stringers} onChange={(e) => updateActiveConfig({ stringers: e.target.checked })} />
            Stringers
          </label>

          <label>
            <input type="checkbox" checked={cfg.bodyBurst} onChange={(e) => updateActiveConfig({ bodyBurst: e.target.checked })} />
            Body Burst
          </label>
          {cfg.bodyBurst && (
            <>
              <label>Burst Edge Color</label>
              <input type="color" value={cfg.bodyBurstColor} onChange={(e) => updateActiveConfig({ bodyBurstColor: e.target.value })} />
            </>
          )}

          <label>
            <input type="checkbox" checked={cfg.headstockMatches} onChange={(e) => updateActiveConfig({ headstockMatches: e.target.checked })} />
            Headstock color matches the body
          </label>
          {!cfg.headstockMatches && (
            <>
              <label>Headstock Texture</label>
              <select value={cfg.headstockTexture} onChange={(e) => updateActiveConfig({ headstockTexture: e.target.value })}>
                <option value="solid">Solid</option>
                <option value="plain">Plain</option>
                <option value="quilt">Quilt</option>
                <option value="flamed">Flamed</option>
              </select>
            </>
          )}
          {!cfg.headstockMatches && (
            <>
              <label>Headstock Color</label>
              <input type="color" value={cfg.headstockColor} onChange={(e) => updateActiveConfig({ headstockColor: e.target.value })} />
            </>
          )}

          <label>
            <input type="checkbox" checked={cfg.headstockBurst} onChange={(e) => updateActiveConfig({ headstockBurst: e.target.checked })} />
            Headstock Burst
          </label>
          {cfg.headstockBurst && (
            <>
              <label>Headstock Burst Color</label>
              <input type="color" value={cfg.headstockBurstColor} onChange={(e) => updateActiveConfig({ headstockBurstColor: e.target.value })} />
            </>
          )}

          {cfg.bodyStyle !== "beveled" && (
            <>
              <label>
                <input type="checkbox" checked={cfg.bodyBinding} onChange={(e) => updateActiveConfig({ bodyBinding: e.target.checked })} />
                Body Binding
              </label>
              {cfg.bodyBinding && (
                <>
                  <label>Body Binding Color</label>
                  <input type="color" value={cfg.bodyBindingColor} onChange={(e) => updateActiveConfig({ bodyBindingColor: e.target.value })} />
                </>
              )}
            </>
          )}

          <label>
            <input type="checkbox" checked={cfg.fretboardBinding} onChange={(e) => updateActiveConfig({ fretboardBinding: e.target.checked })} />
            Fretboard Binding
          </label>
          {cfg.fretboardBinding && (
            <>
              <label>Fretboard Binding Color</label>
              <input type="color" value={cfg.fretboardBindingColor} onChange={(e) => updateActiveConfig({ fretboardBindingColor: e.target.value })} />
            </>
          )}

          <label>
            <input type="checkbox" checked={cfg.headstockBinding} onChange={(e) => updateActiveConfig({ headstockBinding: e.target.checked })} />
            Headstock Binding
          </label>
          {cfg.headstockBinding && (
            <>
              <label>Headstock Binding Color</label>
              <input type="color" value={cfg.headstockBindingColor} onChange={(e) => updateActiveConfig({ headstockBindingColor: e.target.value })} />
            </>
          )}

          <label>Bridge Pickup</label>
          <select value={cfg.bridgePickup} onChange={(e) => updateActiveConfig({ bridgePickup: e.target.value })}>
            {Object.keys(pickupOptions).map((k) => (
              <option value={k} key={k}>{pickupOptions[k].label}</option>
            ))}
          </select>
          {cfg.middlePickup === "none" && cfg.bridgePickup !== "none" && (
            <>
              <label>Bridge Pickup Angle</label>
              <select value={cfg.bridgePickupAngle} onChange={(e) => updateActiveConfig({ bridgePickupAngle: e.target.value })}>
                <option value="default">Default</option>
                <option value="slanted">Slanted</option>
              </select>
            </>
          )}

          <label>Middle Pickup</label>
          <select
            value={cfg.middlePickup}
            onChange={(e) => {
                const newVal = e.target.value;
                if (newVal !== "none") {
                // When selecting a middle pickup, also reset bridge slant to default
                updateActiveConfig({ middlePickup: newVal, bridgePickupAngle: "default" });
                } else {
                updateActiveConfig({ middlePickup: newVal });
                }
            }}
            >
            {Object.entries(pickupOptions).map(([key, { label }]) => (
                <option value={key} key={key}>{label}</option>
            ))}
          </select>


          <label>Neck Pickup</label>
          <select value={cfg.neckPickup} onChange={(e) => updateActiveConfig({ neckPickup: e.target.value })}>
            {Object.entries(pickupOptions).map(([key, { label }]) => (
              <option value={key} key={key}>{label}</option>
            ))}
          </select>

          <label>Bridge</label>
          <select value={cfg.bridge} onChange={(e) => updateActiveConfig({ bridge: e.target.value })}>
            <option value="Floyd Chrome">Floyd Chrome</option>
            <option value="Floyd Gold">Floyd Gold</option>
            <option value="Floyd Black">Floyd Black</option>
            <option value="Wraparound Chrome">Wraparound Chrome</option>
            <option value="Wraparound Gold">Wraparound Gold</option>
            <option value="Wraparound Black">Wraparound Black</option>
          </select>

          <label>Controls</label>
          <select value={cfg.controls} onChange={(e) => updateActiveConfig({ controls: e.target.value })}>
            <option value="v">Volume</option>
            <option value="vs">Volume + Switch</option>
            <option value="vst">Volume + Switch + Tone</option>
          </select>

          <label>Controls Style</label>
          <select value={cfg.controlsStyle} onChange={(e) => updateActiveConfig({ controlsStyle: e.target.value })}>
            <option value="chrome">Chrome</option>
            <option value="gold">Gold</option>
            <option value="black">Black</option>
          </select>

          <label>Tuning Peg Color</label>
          <select value={cfg.tuningPegColor} onChange={(e) => updateActiveConfig({ tuningPegColor: e.target.value })}>
            {Object.entries(tuningPegOptions).map(([key, label]) => (
              <option value={key} key={key}>{label}</option>
            ))}
          </select>

          {/*<button className="randomize-btn" onClick={randomizeConfig}>
             🎲 Randomize
          </button>*/}

          <button className="download-btn" onClick={downloadPNG}>
            Download PNG
          </button>
        </div>
        <div className="preview" ref={previewAreaRef}>
          <div className="panels">
            <GuitarCanvas cfg={configs[0]} scale={scale} isActive={activePanel === 0} onActivate={() => setActivePanel(0)} panelRef={panelRefs[0]} />
            <GuitarCanvas cfg={configs[1]} scale={scale} isActive={activePanel === 1} onActivate={() => setActivePanel(1)} panelRef={panelRefs[1]} />
          </div>
        </div>
      </div>
    </div>
  );
}


