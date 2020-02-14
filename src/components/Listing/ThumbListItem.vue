<template>
  <b-card class="rounded" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <img :src="data.img_ricetta" class="rounded list-thumbnail responsive border-0" :alt="data.title"/>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div class="card-body w-80 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">

        <template v-for="(field, index) in fields">

          <!-- BADGE WITH ICON AND LINK -->
          <div v-if="Number(field.in_list) > 0 && field.background && field.action === 'fileOpen' && field.link !== '{link}'" class=" w-sm-100" :class="`w-${columnWith}`" :key="index">
            <a
              target="_blank"
              :href="hrefLink(field.link, data.protocollo_file, data.tipo_di_file)"
              class="badge badge-pill"
              :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
              :key="field.field"
            >
              <i :class="`mr-1 glyph-icon ${field.icon ? field.icon : 'simple-icon-cloud-download'}`"/> <span v-html="decodeHTML(data[field.field])" />
            </a>
          </div>

          <!-- BADGE WITH ICON AND EXTERNAL LINK -->
          <div v-if="Number(field.in_list) > 0 && field.background && field.link === '{link}'" class=" w-sm-100" :class="`w-${columnWith}`" :key="index">
            <a
              target="_blank"
              :href="data[field.field]"
              class="badge badge-pill"
              :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
              :key="field.field"
            >
              <i :class="`mr-1 glyph-icon ${field.icon ? field.icon : 'simple-icon-cloud-download'}`"/> <span v-html="decodeHTML(data.nome)" />
            </a>
          </div>

          <!-- NORMAL BADGE -->
          <div v-else-if="Number(field.in_list) > 0 && field.background" class="w-sm-100" :class="`w-${columnWith}`" :key="index">
            <span class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(data[field.field])" />
          </div>

          <!-- OTHER ITEMS IN LIST -->
          <p v-else-if="Number(field.in_list) > 0 && data[field.field]" class="mb-1 text-muted text-small text-center w-sm-100" :class="`w-${columnWith}`" :key="field.field" v-html="decodeHTML(data[field.field])"/>
        </template>
      </div>
      <b-row class="w-20">
        <template v-for="action in actions">
          <div v-if="action === 'modify'" class="pl-1 align-self-center pr-4" :key="action">
            <a @click.prevent="modifyItem($event, data, false)" v-b-tooltip.hover :title="capitalize(action)">
              <i  :class="'glyph-icon simple-icon-note'"/>
            </a>
          </div>
          <div v-if="action === 'copy'" class="pl-1 align-self-center pr-4" :key="action">
            <a @click.prevent="copyItem($event, data)" v-b-tooltip.hover :title="capitalize(action)">
              <i  :class="'glyph-icon simple-icon-docs'"/>
            </a>
          </div>
          <div v-if="action === 'delete'" class="pl-1 align-self-center pr-4" :key="action">
            <a v-b-tooltip.hover :title="capitalize(action)">
              <i  :class="'glyph-icon simple-icon-trash'"/>
            </a>
          </div>
          <div v-if="action === 'print'" class="pl-1 align-self-center pr-4" :key="action">
            <a v-b-tooltip.hover :title="capitalize(action)">
              <i  :class="'glyph-icon simple-icon-printer'"/>
            </a>
          </div>
        </template>

        <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
          <b-form-checkbox @click.prevent="toggleItem($event,data.id)" :checked="selectedItems.includes(data.id)" class="itemCheck mb-0"/>
        </div>
      </b-row>
    </div>
  </b-card>
</template>
<script>
export default {
  props: ['data', 'selectedItems', 'fields', 'selectOptions', 'actions'],
  methods: {
    decodeHTML (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    toggleItem (event, itemId) {
      this.$emit('toggle-item', event, itemId)
    },
    modifyItem (event, item) {
      this.$emit('modify-item', event, item)
    },
    hrefLink (link, protocolloFile, fileType) {
      if (!link) {
        console.log('No link', protocolloFile)
      }

      let originalLink = link || ''
      let linkFormatted = originalLink.replace('{protocollo_file}', protocolloFile)
      linkFormatted = fileType ? linkFormatted.replace('{tipo_di_file}', fileType.toLowerCase()) : linkFormatted
      const protocol = location.protocol
      const host = location.hostname
      const entryPoint = process.env.NODE_ENV === 'production' ? protocol + '//' + host + '/' : 'https://peakfood.condivision.cloud/'
      return entryPoint + linkFormatted
    },
    filterOptions (id) {
      // console.log('id', typeof id)
      // console.log('selectOptions', this.selectOptions)
      this.selectOptions.forEach(option => {
        if (option.id === id) {
          return option.label
        } else {
          return id
        }
      })
      return id
    },
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/, ' ')
    }
  },
  computed: {
    columnWith () {
      const width = Math.floor(100 / this.fields.length)
      return width.toString()
    }
  }
}
</script>
