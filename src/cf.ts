/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const color = document.getElementById('color') as HTMLInputElement;
const lucky = document.getElementById('lucky') as HTMLInputElement;
const cf = document.getElementById('cf') as ControlledFrame;
const controls = document.getElementById('controls') as HTMLFormElement;

controls.addEventListener('submit', (e) => {
  e.preventDefault();
});

color.addEventListener('change', () => {
  const c = color.value;
  const css = `body { background: ${c} !important; }`;
  console.log(css);
  cf.insertCSS({
    code: css,
  });
});

lucky.addEventListener('change', () => {
  cf.executeScript({
    code: `
    document.querySelector(\`[aria-label="I'm Feeling Lucky"][role="button"]\`).value = "I'm Feeling ${lucky.value}";
    `,
  });
});
