<template>
  <div class="h-100">
    <div v-if="initIsLoad === false" class="loading"></div>
    <router-view/>
  </div>
</template>
<script>
import { getDirection } from '@/utils'
// import { user } from '@/main'

export default {
  name: 'App',
  beforeMount () {
    const direction = getDirection()
    if (direction.isRtl) {
      document.body.classList.add('rtl')
      document.dir = 'rtl'
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.dir = 'ltr'
      document.body.classList.remove('rtl')
    }
  },
  computed: {
    preloader () {
      return this.$store.state.preloader
    },
    initIsLoad () {
      return this.$store.getters.getInitIsLoad
    }
  },
  beforeCreate () {
    this.$store.dispatch('getInitialData')
  }
}
</script>

<style>
.loading {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0,0,0,.2 );
  border-radius: 50%;
  border-top-color: rgba(0,0,0,.4 );
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
  left: calc(50%);
  top: calc(50%);
  position: fixed;
  z-index: 1;
}

.dark-background {
  background-color: black;
}

@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}

@font-face {
  font-family: 'icomoon';
  src:  url('/assets/fonts/icomoon/icomoon.eot?z1fzcj');
  src:  url('/assets/fonts/icomoon/icomoon.eot?z1fzcj#iefix') format('embedded-opentype'),
    url('/assets/fonts/icomoon/icomoon.ttf?z1fzcj') format('truetype'),
    url('/assets/fonts/icomoon/icomoon.woff?z1fzcj') format('woff'),
    url('/assets/fonts/icomoon/icomoon.svg?z1fzcj#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"], [class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-heart1:before {
  content: "\e901";
}
.icon-heart:before {
  content: "\e900";
}
.icon-strategy:before {
  content: "\e902";
}
.icon-horse:before {
  content: "\e902";
}
.icon-chess:before {
  content: "\e902";
}
.icon-piece:before {
  content: "\e902";
}

.icon-horse:before {
  content: "\e902";
}

</style>
