(function () {
  const controls = document.getElementById("controls");
  const output = document.getElementById("output");
  const outputCode = document.getElementById("output-code");
  const copyBtn = document.getElementById("copy");

  const svgAttributes = {
    circumference: "565.48px",
    percentage: "118.692px",
    progress: 79,
    size: 200,
    backgroundColor: "#ffffff",
    backgroundOp: "0",
    circleColor: "#e0e0e0",
    progressColor: "#76e5b1",
    circleWidth: "16px",
    progressWidth: "16px",
    progressShape: "round",
    textColor: "#6bdba7",
    textSize: {
      width: 50,
      height: 50,
      fontSize: "52",
    },
    valueToggle: true,
    percentageToggle: false,
  };
  function addOpacityToHex(hexColor, opacity) {
    // ?? hexColor ???? 6 ? HEX ??
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hexColor)) {
      throw new Error("Invalid HEX color format");
    }
    hexColor = hexColor.replace(/^#/, "");

    opacity = Math.max(0, Math.min(1, opacity));

    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${hexColor}${alpha}`;
  }

  function getSvg(attributes) {
    const {
      circumference,
      percentage,
      progress,
      size,
      circleColor,
      progressColor,
      circleWidth,
      progressWidth,
      progressShape,
      textColor,
      textSize,
      valueToggle,
      percentageToggle,
      backgroundColor,
      backgroundOp,
    } = attributes;

    const suffix = percentageToggle ? "%" : "";
    const text = valueToggle
      ? `\n    <text x="${Math.round(
          size / 2 - textSize.width / 1.75
        )}px" y="${Math.round(
          size / 2 + textSize.height / 3.25
        )}px" fill="${textColor}" font-size="${
          textSize.fontSize
        }px" font-weight="bold" style="transform:rotate(90deg) translate(0px, -${
          size - 4
        }px)">${progress}${suffix}</text>`
      : "";

    return `
  <svg width="${size}" height="${size}" viewBox="-${size * 0.125} -${
      size * 0.125
    } ${size * 1.25} ${
      size * 1.25
    }" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg); background-color: ${addOpacityToHex(
      backgroundColor,
      backgroundOp
    )}">
    <circle r="${size / 2 - 10}" cx="${size / 2}" cy="${
      size / 2
    }" fill="transparent" stroke="${circleColor}" stroke-width="${circleWidth}" stroke-dasharray="${circumference}" stroke-dashoffset="0"></circle>
    <circle r="${size / 2 - 10}" cx="${size / 2}" cy="${
      size / 2
    }" stroke="${progressColor}" stroke-width="${progressWidth}" stroke-linecap="${progressShape}" stroke-dashoffset="${percentage}" fill="transparent" stroke-dasharray="${circumference}"></circle>${text}
  </svg>
    `;
  }

  function setTextSize() {
    if (svgAttributes.valueToggle) {
      const svgText = document.querySelector("text");
      const textRect = svgText.getBoundingClientRect();
      svgAttributes.textSize = {
        width: Math.round(textRect.width),
        height: Math.round(textRect.height),
        fontSize: svgAttributes.textSize.fontSize,
      };
    }
  }

  function handleFormChange(e) {
    let value = e.target.value;
    let rerender = false;
    if (e.target.name === "progress") {
      const radius = svgAttributes.size / 2 - 10;
      const circumference = 3.14 * radius * 2;
      svgAttributes.percentage =
        Math.round(circumference * ((100 - e.target.valueAsNumber) / 100)) +
        "px";
      if (e.target.valueAsNumber === 0) {
        svgAttributes.progressColor = svgAttributes.circleColor;
      } else if (
        e.target.valueAsNumber > 0 &&
        svgAttributes.progressColor === svgAttributes.circleColor
      ) {
        svgAttributes.progressColor = controls.progressColor.value;
      }
      setTextSize();
      rerender = true;
    } else if (e.target.name === "size") {
      const radius = e.target.valueAsNumber / 2 - 10;
      const circumference = 3.14 * radius * 2;
      svgAttributes.circumference = circumference + "px";
      svgAttributes.percentage =
        Math.round(circumference * ((100 - svgAttributes.progress) / 100)) +
        "px";
    } else if (e.target.type === "checkbox") {
      value = e.target.checked;
      if (e.target.name === "percentageToggle") {
        setTextSize();
      }
      rerender = true;
    } else if (e.target.name === "textSize") {
      const svgText = document.querySelector("text");
      const textRect = svgText.getBoundingClientRect();
      value = {
        width: Math.round(textRect.width),
        height: Math.round(textRect.height),
        fontSize: value,
      };
      rerender = true;
    } else if (
      e.target.name === "backgroundOp" &&
      e.target.name === "backgroundColor"
    ) {
      rerender = true;
    }
    svgAttributes[e.target.name] = value;
    setSvg(rerender);
  }

  function setSvg(rerender = false) {
    const html = getSvg(svgAttributes);
    output.innerHTML = html;
    outputCode.innerText = html;
    if (rerender) {
      setTextSize();
      setSvg(false);
    }
  }

  function handleCopy(e) {
    navigator.clipboard.writeText(outputCode.innerText);
    const currentValue = e.target.innerText;
    e.target.innerText = "Copied!";
    setTimeout(function () {
      e.target.innerText = currentValue;
    }, 2000);
  }

  setSvg(false);

  controls.addEventListener("input", handleFormChange);
  copyBtn.addEventListener("click", handleCopy);

  async function convertSVGsToPNGsAndZip(svgArray) {
    const zip = new JSZip();

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    async function svgToPng(svgString, index) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve({ blob, index });
          }, "image/png");
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgString);
      });
    }

    const pngPromises = svgArray.map((svg, index) => svgToPng(svg, index));
    const pngResults = await Promise.all(pngPromises);

    pngResults.forEach(({ blob, index }) => {
      zip.file(`${index}.png`, blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(zipBlob);
    downloadLink.download = "svg_to_png_images.zip";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  function handleGetp() {
    const sa = [];
    for (let index = 1; index <= 100; index++) {
      progressrange.value = index;
      const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      progressrange.dispatchEvent(inputEvent);
      sa.push(output.innerHTML);
    }
    convertSVGsToPNGsAndZip(sa).then();
  }
  const getpBtn = document.getElementById("get-pngs");
  getpBtn.addEventListener("click", handleGetp);
})();
