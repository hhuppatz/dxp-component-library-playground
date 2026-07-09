#!/usr/bin/env node
// Fetch https://www.sa.gov.au/editors/design/elements and convert to Markdown
// For each local component, either summarise matching guidance from the page via an LLM
// or (if no match) ask the LLM to suggest guidance based on the component name.

import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';

const URL = 'https://www.sa.gov.au/editors/design/elements';
const OUT_DIR = 'docs/guides';
const OUT_FILE = path.join(OUT_DIR, 'sa-design-elements.md');
const COMPONENTS_DIR = 'dxp/component-service';

async function fetchHtml(url){
  const res = await fetch(url, { headers: { 'User-Agent': 'dxp-component-library-bot/1.0 (+https://github.com)' } });
  if(!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function textOf(node){
  return node.textContent.replace(/\s+/g,' ').trim();
}

function extractSections(root){
  const main = root.querySelector('main') || root.querySelector('article') || root.querySelector('[role="main"]') || root;
  const sections = [];
  let current = { title: '', text: '' };
  main.childNodes.forEach(node => {
    if(!node.tagName) return; // skip non-elements
    const tag = node.tagName.toLowerCase();
    if(/^h[1-6]$/.test(tag)){
      if(current.title || current.text) sections.push(current);
      current = { title: textOf(node), text: '' };
    } else {
      const t = textOf(node);
      if(t) current.text += (current.text ? '\n\n' : '') + t;
    }
  });
  if(current.title || current.text) sections.push(current);
  return sections;
}

function listComponents(){
  if(!fs.existsSync(COMPONENTS_DIR)) return [];
  return fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => fs.existsSync(path.join(COMPONENTS_DIR, name, 'manifest.json')));
}

function findBestMatchForComponent(sections, compName){
  const nameParts = compName.toLowerCase().replace(/[-_]/g,' ').split(/\s+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for(const s of sections){
    const hay = (s.title + ' ' + s.text).toLowerCase();
    let score = 0;
    nameParts.forEach(p => { if(hay.includes(p)) score += 1; });
    if(hay.includes(compName.toLowerCase())) score += 2;
    if(score > bestScore){ bestScore = score; best = s; }
  }
  // threshold: require at least one match
  return bestScore > 0 ? best : null;
}

async function callAnthropic(prompt){
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key) throw new Error('No ANTHROPIC_API_KEY');
  const model = process.env.MODELS_MODEL || 'claude-2.1';
  const body = {
    model,
    prompt,
    max_tokens: 300,
    temperature: 0.2
  };
  const res = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key },
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const json = await res.json();
  return json.completion || json.output || json.text || '';
}

async function callOpenAI(prompt){
  const key = process.env.OPENAI_API_KEY;
  if(!key) throw new Error('No OPENAI_API_KEY');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.2, max_tokens: 300 })
  });
  if(!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const j = await res.json();
  return j?.choices?.[0]?.message?.content || '';
}

async function summarizeForComponent(compName, matchedSection){
  const header = matchedSection ?
    `Summarise the following design guidance for a component named "${compName}". Produce a concise (2-4 sentence) Markdown paragraph aimed at implementers: focus on visual attributes, spacing, accessibility, and any usage notes. Include a short "Source:" line at the end referencing the URL.

Content:\n\n${matchedSection.title}\n\n${matchedSection.text}`
    : `No external guidance was found for a component named "${compName}" on the provided page. Based only on the component name "${compName}", produce a concise (2-4 sentence) Markdown paragraph describing likely usage, important visual attributes, and accessibility considerations. Do not invent specific verbatim policy text; state these as suggested best-practices.`;

  // Prefer Anthropic if key present, otherwise OpenAI if key present
  try{
    if(process.env.ANTHROPIC_API_KEY){
      const out = await callAnthropic(header);
      return out.trim();
    }
    if(process.env.OPENAI_API_KEY){
      const out = await callOpenAI(header);
      return out.trim();
    }
  } catch(err){
    console.error('LLM call failed for', compName, err.message);
  }
  // Fallback templates if no LLM available
  if(matchedSection){
    const snippet = matchedSection.text.split('\n').slice(0,3).join(' ');
    return `${snippet}\n\nSource: ${URL}`;
  }
  return `No external guidance found. Suggested focus for component "${compName}": ensure accessible semantics, clear spacing, and consistent use of color and typography.`;
}

async function run(){
  try{
    const html = await fetchHtml(URL);
    const root = parse(html);
    const sections = extractSections(root);
    const components = listComponents();

    if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const outLines = [];
    outLines.push(`<!-- source: ${URL} | retrieved: ${new Date().toISOString()} -->\n`);
    outLines.push('# SA Design elements — component-aligned guidance\n');

    for(const comp of components){
      const match = findBestMatchForComponent(sections, comp);
      const summary = await summarizeForComponent(comp, match);
      outLines.push(`## ${comp}\n`);
      outLines.push(`${summary}\n`);
      // small pause to reduce request bursts
      await new Promise(r => setTimeout(r, 300));
    }

    fs.writeFileSync(OUT_FILE, outLines.join('\n'), 'utf8');
    console.log('Wrote', OUT_FILE);
  } catch(err){
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
