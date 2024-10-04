!function(){let e=document.getElementById("controls"),t=document.getElementById("output"),r=document.getElementById("output-code"),n=document.getElementById("copy"),o={circumference:"565.48px",percentage:"118.692px",progress:79,size:200,circleColor:"#e0e0e0",progressColor:"#76e5b1",circleWidth:"16px",progressWidth:"16px",progressShape:"round",textColor:"#6bdba7",textSize:{width:50,height:50,fontSize:"52"},valueToggle:!0,percentageToggle:!1};function i(){if(o.valueToggle){let e=document.querySelector("text").getBoundingClientRect();o.textSize={width:Math.round(e.width),height:Math.round(e.height),fontSize:o.textSize.fontSize}}}function a(e=!1){let n=function(e){let{circumference:t,percentage:r,progress:n,size:o,circleColor:i,progressColor:a,circleWidth:l,progressWidth:c,progressShape:g,textColor:s,textSize:d,valueToggle:u,percentageToggle:h}=e,p=u?`
    <text x="${Math.round(o/2-d.width/1.75)}px" y="${Math.round(o/2+d.height/3.25)}px" fill="${s}" font-size="${d.fontSize}px" font-weight="bold" style="transform:rotate(90deg) translate(0px, -${o-4}px)">${n}${h?"%":""}</text>`:"";return`
  <svg width="${o}" height="${o}" viewBox="-${.125*o} -${.125*o} ${1.25*o} ${1.25*o}" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg)">
    <circle r="${o/2-10}" cx="${o/2}" cy="${o/2}" fill="transparent" stroke="${i}" stroke-width="${l}" stroke-dasharray="${t}" stroke-dashoffset="0"></circle>
    <circle r="${o/2-10}" cx="${o/2}" cy="${o/2}" stroke="${a}" stroke-width="${c}" stroke-linecap="${g}" stroke-dashoffset="${r}" fill="transparent" stroke-dasharray="${t}"></circle>${p}
  </svg>
    `}(o);t.innerHTML=n,r.innerText=n,e&&(i(),a(!1))}async function l(e){let t=new JSZip,r=document.createElement("canvas"),n=r.getContext("2d");async function o(e,t){return new Promise(o=>{let i=new Image;i.onload=()=>{r.width=i.width,r.height=i.height,n.clearRect(0,0,r.width,r.height),n.drawImage(i,0,0),r.toBlob(e=>{o({blob:e,index:t})},"image/png")},i.src="data:image/svg+xml;base64,"+btoa(e)})}let i=e.map((e,t)=>o(e,t));(await Promise.all(i)).forEach(({blob:e,index:r})=>{t.file(`image_${r+1}.png`,e)});let a=await t.generateAsync({type:"blob"}),l=document.createElement("a");l.href=URL.createObjectURL(a),l.download="svg_to_png_images.zip",document.body.appendChild(l),l.click(),document.body.removeChild(l)}a(!1),e.addEventListener("input",function(t){let r=t.target.value,n=!1;if("progress"===t.target.name){let r=o.size/2-10;o.percentage=Math.round(3.14*r*2*((100-t.target.valueAsNumber)/100))+"px",0===t.target.valueAsNumber?o.progressColor=o.circleColor:t.target.valueAsNumber>0&&o.progressColor===o.circleColor&&(o.progressColor=e.progressColor.value),i(),n=!0}else if("size"===t.target.name){let e=3.14*(t.target.valueAsNumber/2-10)*2;o.circumference=e+"px",o.percentage=Math.round(e*((100-o.progress)/100))+"px"}else if("checkbox"===t.target.type)r=t.target.checked,"percentageToggle"===t.target.name&&i(),n=!0;else if("textSize"===t.target.name){let e=document.querySelector("text").getBoundingClientRect();r={width:Math.round(e.width),height:Math.round(e.height),fontSize:r},n=!0}o[t.target.name]=r,a(n)}),n.addEventListener("click",function(e){navigator.clipboard.writeText(r.innerText);let t=e.target.innerText;e.target.innerText="Copied!",setTimeout(function(){e.target.innerText=t},2e3)}),document.getElementById("get-pngs").addEventListener("click",function(){let e=[];for(let r=1;r<=100;r++){progressrange.value=r;let n=new Event("input",{bubbles:!0,cancelable:!0});progressrange.dispatchEvent(n),e.push(t.innerHTML)}l(e).then()})}();
//# sourceMappingURL=index.cedf1fc5.js.map
