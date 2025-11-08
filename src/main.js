import "./style.css";
import { setupCounter } from "./counter.js";

document.querySelector("#app").innerHTML = `
  <div>    
  <h3>Counter Example</h3>
    <div class="card">
      <button id="counter" type="button"></button>      
    </div>
  </div>
`;

setupCounter(document.querySelector("#counter"));
