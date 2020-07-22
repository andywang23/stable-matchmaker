import React from 'react';

import { useState, useEffect } from 'react';

const PrefSelector = () => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = '/scripts/prefselector.js';
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main>
      <h1 id="title">
        <span class="inner">Rank List</span>
      </h1>
      <div id="limbo"></div>
      <p id="coords">
        X: <span id="x-coord"></span> Y: <span id="y-coord"></span>
      </p>
      <main>
        <div class="holster-wrapper clearfix">
          <div class="holster">
            <div class="list-item object1">
              <div class="list-item-background">Zarya</div>
            </div>
          </div>
          <div class="holster">
            <div class="list-item object2">
              <div class="list-item-background">Diablo</div>
            </div>
          </div>
          <div class="holster">
            <div class="list-item object3">
              <div class="list-item-background">Sonya</div>
            </div>
          </div>
          <div class="holster">
            <div class="list-item object4">
              <div class="list-item-background">Anub'Arak</div>
            </div>
          </div>
          <div class="holster">
            <div class="list-item object4">
              <div class="list-item-background">Dehaka</div>
            </div>
          </div>
        </div>

        <div class="list-wrapper">
          <div class="list-spot spot-1"></div>
          <div class="list-spot spot-2"></div>
          <div class="list-spot spot-3"></div>
          <div class="list-spot spot-4"></div>
          <div class="list-spot spot-4"></div>
        </div>
      </main>
      <footer>
        <script src="./js/drag.js"></script>
      </footer>
    </main>
  );
};

export default PrefSelector;
