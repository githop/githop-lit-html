import { render } from 'lit-html';
import { Root } from './templates/root';
import 'dark-mode-toggle';
import { registerSw } from './registerSw';

registerSw();

render(Root(), document.body);
