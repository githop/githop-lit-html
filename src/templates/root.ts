import { html } from 'lit-html';
import { Resume } from './resume';

export function Root() {
  return html`<div class="gth-root --y-padding">
    <dark-mode-toggle id="dark-mode-toggle"></dark-mode-toggle>
    ${Resume()}
  </div>`;
}
