// Regenerate the static knowledge map after editing knowledge-map.json.
// Run: node scripts/render-knowledge-map.mjs
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
function renderMap(modules){
  const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  const drawings=[
    '<path d="M5 19h28M10 24V4M12 19c4-1 6-12 11-12s5 9 10 10"/><circle cx="23" cy="7" r="1.6" fill="currentColor" stroke="none"/>',
    '<path d="m13 7-8 10 8 10m12-20 8 10-8 10M21 5l-4 24"/>',
    '<path d="M9 9l11 8m-11 10 11-10m0 0 11-10m-11 10 11 10"/><circle cx="9" cy="9" r="3"/><circle cx="9" cy="27" r="3"/><circle cx="20" cy="17" r="3"/><circle cx="31" cy="7" r="3"/><circle cx="31" cy="27" r="3"/>',
    '<circle cx="15" cy="15" r="9"/><path d="m22 22 9 9M11 15h8m-4-4v8"/>',
    '<rect x="5" y="6" width="8" height="8" rx="1.5"/><rect x="24" y="6" width="8" height="8" rx="1.5"/><rect x="5" y="25" width="8" height="8" rx="1.5"/><rect x="24" y="25" width="8" height="8" rx="1.5"/><path d="M13 10h11M9 14v11m19-11v11M13 29h11M13 14l11 11"/>',
    '<path d="M6 29h28M9 24l8-8 5 4 10-13m-7 0h7v7"/><circle cx="17" cy="16" r="1.5" fill="currentColor" stroke="none"/>',
    '<path d="M30 12a12 12 0 1 0 1 13m-1-13V5m0 7h-7"/><path d="m16 18 3 3 6-7"/>',
    '<path d="M7 7v24h26M12 25v-7m7 7V12m7 13V7"/><path d="M10 10l5 2 5-5 6 2"/>',
    '<rect x="8" y="8" width="22" height="22" rx="3"/><rect x="14" y="14" width="10" height="10" rx="1"/><path d="M13 3v5m6-5v5m6-5v5M13 30v5m6-5v5m6-5v5M3 13h5m-5 6h5m-5 6h5m22-12h5m-5 6h5m-5 6h5"/>',
    '<path d="M19 4c0 10-5 15-15 15 10 0 15 5 15 15 0-10 5-15 15-15-10 0-15-5-15-15Z"/><path d="M29 4v6m-3-3h6M7 27v6m-3-3h6"/>'
  ];
  const mark=i=>`<svg class="module-mark" width="40" height="40" viewBox="0 0 38 38" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawings[i]}</svg>`;
  const arrow='<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4"/></svg>';
  const caret='<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg>';
  const baseUrl="https://hea233.github.io";
  const template=(title,path,body,isHome)=>`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="A personal AI and machine learning knowledge map.">
<meta name="author" content="HEA233">
<link rel="canonical" href="${baseUrl}${path}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${esc(title)}">
<meta property="og:url" content="${baseUrl}${path}">
<meta property="og:type" content="website">
<link rel="stylesheet" href="/_astro/Layout.BcIYCpiY.css">
<link rel="stylesheet" href="${isHome?'/knowledge-home.css':'/knowledge.css'}">
</head>
<body class="${isHome?'knowledge-landing':'knowledge-site'}">
<a class="skip" href="#main">Skip to content</a>
<div class="shell">
<header class="site-header knowledge-header">
<a class="brand" href="/" aria-label="HEA233 home"><strong>HEA233</strong><span class="brand-divider" aria-hidden="true">/</span><span>ML Engineering Notebook</span></a>
<nav aria-label="Main navigation"><a href="/"${isHome?' aria-current="page"':''}>Knowledge Map</a><a href="/about/">About</a></nav>
</header>
<main id="main">${body}</main>
<footer><span>© HEA233</span><a href="https://github.com/HEA233">GitHub</a></footer>
</div>
</body>
</html>
`;
  const artOrder=["mathematics","computer-science","machine-learning","information-retrieval","foundation-models","llm-training","reinforcement-learning","evaluation","ml-systems","frontier-research"];
  const cards=modules.map(m=>{
    const n=artOrder.indexOf(m.slug);
    const art=n<0?"":`<div class="module-art" style="--art-x:${n%2*100}%;--art-y:${Math.floor(n/2)*25}%" aria-hidden="true"></div>`;
    return `<a class="module-card" href="/knowledge/${esc(m.slug)}/">
${art}
<span class="module-code">${esc(m.id)}</span>
<h2>${esc(m.title)}</h2>
<p class="module-topics">${m.topics.map(t=>`<span>${esc(t.title)}</span>`).join('<span class="topic-separator" aria-hidden="true"> · </span>')}</p>
</a>`;
  }).join("\n");
  const home=`<div class="knowledge-home">
<header class="map-heading"><h1>Knowledge Map</h1></header>
<section class="module-grid" aria-label="Learning modules">${cards}</section>
</div>`;
  const files=[{path:"public/index.html",content:template("ML Engineering Notebook · Knowledge Map","/",home,true)}];
  for(const [i,m] of modules.entries()){
    const rows=m.topics.map((t,j)=>{
      const articles=t.articles||[];
      const articleLinks=articles.map(a=>{
        const title=a==="/blog/reranker/"?"Reranker：从候选召回到排序损失":a;
        return `<li class="published-note"><a href="${esc(a)}"><span class="note-icon"><svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2.5h6l4 4V17.5H5zM11 2.5v4h4M7.5 10h5m-5 3h5"/></svg></span><span><span class="note-title" lang="zh-CN">${esc(title)}</span></span><span class="note-arrow">${arrow}</span></a></li>`;
      }).join("");
      return `<details class="topic-row"${articles.length?" open":""}>
<summary><span class="topic-number">${String(j+1).padStart(2,"0")}</span><span class="topic-name">${esc(t.title)}</span><span class="topic-arrow">${caret}</span></summary>
<ul class="topic-list">${t.subtopics.map(s=>`<li class="subtopic"><span class="subtopic-dot" aria-hidden="true"></span>${esc(s)}</li>`).join("")}${articleLinks}</ul>
</details>`;
    }).join("\n");
    const body=`<div class="module-page">
<nav class="module-breadcrumb" aria-label="Breadcrumb"><a href="/"><span aria-hidden="true">←</span> All modules</a><span class="crumb-divider" aria-hidden="true">/</span><span>${esc(m.id)}</span></nav>
<header class="module-heading"><div><h1>${esc(m.title)}</h1></div><div class="heading-mark">${mark(i)}</div></header>
<section class="topic-section" aria-label="Knowledge index"><div class="topic-index">${rows}</div></section>
</div>`;
    files.push({path:`public/knowledge/${m.slug}/index.html`,content:template(`${m.title} · ML Engineering Notebook`,`/knowledge/${m.slug}/`,body,false)});
  }
  return files;
}
const modules = JSON.parse(readFileSync('knowledge-map.json', 'utf8'));
for (const {path, content} of renderMap(modules)) {
  mkdirSync(dirname(path), {recursive:true});
  writeFileSync(path, content);
}
