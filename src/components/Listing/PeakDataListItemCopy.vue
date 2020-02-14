<template>
<div>
  <template v-if="index === 0 ">
    <div class="d-flex flex-row">
      <div class="pl-2 d-flex flex-grow-1 min-width-zero">
        <div style="padding-left:24px" class="card-body w-100 pt-0 align-self-center d-flex flex-column flex-lg-row">
          <template v-for="(field, index) in localFields">
            <div v-if="Number(field.in_list) > 0" class="d-none d-lg-block d-xl-block text-truncate" :class="getHeaderWidth(index)" :key="field.field">
              <span v-if="showHeader(field) && field.field === 'categoria_ricetta'">Categoria</span>
              <span v-else-if="showHeader(field) && field.field === 'food_sell_actual'">
                Food Sell
              </span>
              <span v-else-if="showHeader(field) && field.field === 'tempo_di_preparazione'" v-b-popover.hover.top="'Tempo di Preparazione'">
                TP
              </span>
              <span v-else-if="showHeader(field)">{{ capitalize(field.field) }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>

  <b-card class="rounded" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div class="card-body w-100 w-sm-100 align-self-center d-flex flex-column flex-lg-row align-items-lg-center">
        <!-- <template v-for="(field, index) in fields"> -->
        <template v-for="(field, index) in localFields">
          <div v-if="Number(field.in_list) > 0 && data[field.field] !== null" class="w-sm-100" :class="getWidth(index)" :key="field.field + field.id">
            <!-- MOBILE HEADER -->
            <span v-if="isPeak" class="d-lg-none d-xl-none">{{ capitalize(field.field) }}</span>

            <!-- FAVORITE SWITCH -->
            <div v-if="field.field === 'favorite' && moduleId == 7" class="w-sm-100 mind-icons" @click="toggleFavorite">
              <i style="font-size: 24px; cursor: pointer" class="glyph-icon" :class="{'icon-heart': data.favorite == 0, 'icon-heart1': data.favorite == 1}"/>
            </div>
            <div v-if="field.field === 'favorite' && moduleId == 5" class="w-sm-100 mind-icons" @click="toggleFavorite">
              <i style="font-size: 24px; cursor: pointer" class="glyph-icon" :class="{'icon-heart': data.favorite == 0, 'icon-heart1': data.favorite == 1}"/>
            </div>

            <!-- FIRST ICON OF CATEGORIA VENDITTA -->
            <!-- <div v-if="field.type === 'hiddenSelect'" class="w-sm-100 mind-icons">
              <i style="font-size: 24px" :class="`glyph-icon ${getIcon(data[field.field])}`"/>
            </div> -->

            <!-- BADGE WITH ICON AND LINK -->
            <div v-else-if="field.background && field.action === 'fileOpen' && field.link !== '{link}'" class="w-sm-100">
              <a
                target="_blank"
                :href="hrefLink(field.link, data.protocollo_file, data.tipo_di_file)"
                class="badge badge-pill"
                :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
              >
                <i :class="`mr-1 glyph-icon ${field.icon ? field.icon : 'simple-icon-cloud-download'}`"/> <span v-html="decodeHTML(data[field.field])" />
              </a>
            </div>

            <!-- BADGE WITH ICON AND EXTERNAL LINK -->
            <div v-else-if="field.background && field.link === '{link}'" class="w-sm-100">
              <a
                target="_blank"
                :href="data[field.field]"
                class="badge badge-pill"
                :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
              >
                <i :class="`mr-1 glyph-icon ${field.icon ? field.icon : 'simple-icon-cloud-download'}`"/> <span v-html="decodeHTML(data.nome)" />
              </a>
            </div>

            <!-- NORMAL BADGE -->
            <div v-else-if="field.background && field.action !== 'fileOpen' && field.field !== 'categoria_vendita'" class="w-sm-100">
              <span v-if="field.type === 'select'" class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(getOption(data[field.field]))" />
              <span v-else-if="field.type === 'selectText'" class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(getOption(data[field.field]))" />
              <span v-else class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(data[field.field])" />
            </div>

            <!-- ITEMS THAT REQUIRE OPTIONS LOADED -->
            <p v-else-if="field.type === 'select'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(getOption(data[field.field]))"/>
            <p v-else-if="field.type === 'selectText'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(getOption(data[field.field]))"/>
            <!-- OTHER ITEMS IN LIST -->
            <p v-else-if="field.action !== 'fileOpen' && field.field !== 'favorite' && field.type !== 'selectText'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(data[field.field])"/>
          </div>
          <p v-if="field.field === 'margine'" class="mb-1 w-10 text-muted text-small w-sm-100" :key="field.field + index">{{ field.value }}</p>

          <div v-if="field.field === 'ingredients'" class="w-10 align-self-center" :key="index">
            <b-btn @click.prevent="openDistintaBase" variant="primary" class="badge badge-pill">Ingredienti</b-btn>
          </div>

          <div v-if="field.field === 'actions'" class="w-sm-100 d-flex flex-grow-1 justify-content-end" :key="index" :class="`w-25`">
            <template v-for="action in actions">
              <div v-if="action === 'modify'" class="pl-1 align-self-center mx-2" :key="action">
                <a @click.prevent="modifyItem($event, data, false)" v-b-tooltip.hover :title="capitalize(action)">
                  <i  :class="'glyph-icon simple-icon-note'"/>
                </a>
              </div>
              <div v-if="action === 'copy'" class="pl-1 align-self-center mx-2" :key="action">
                <a @click.prevent="copyItem($event, data)" v-b-tooltip.hover :title="capitalize(action)">
                  <i  :class="'glyph-icon simple-icon-docs'"/>
                </a>
              </div>
              <div v-if="action === 'delete'" class="pl-1 align-self-center mx-2" :key="action">
                <a @click="deleteConfirm" v-b-tooltip.hover :title="capitalize(action)">
                  <i  :class="'glyph-icon simple-icon-trash'"/>
                </a>
              </div>
              <div v-if="action === 'print'" class="pl-1 align-self-center mx-2" :key="action">
                <a v-b-tooltip.hover :title="capitalize(action)">
                  <i  :class="'glyph-icon simple-icon-printer'"/>
                </a>
              </div>
            </template>

            <div class="custom-control custom-checkbox pl-1 align-self-center ml-2">
              <b-form-checkbox @change="toggleItem($event,data.id)" :checked="selectedItems.includes(data.id)" class="itemCheck mb-0"/>
            </div>
          </div>
        </template>
      </div>
    </div>
  </b-card>
</div>

</template>
<script>
export default {
  props: ['data', 'selectedItems', 'fields', 'actions', 'options', 'index'],
  data: () => ({
    boxOne: ''
  }),
  methods: {
    toggleFavorite () {
      this.$emit('handle-favorite', this.data)
    },
    getHeaderWidth (index) {
      if (index === 0 && this.moduleId === 3) {
        return { 'w-10': true }
      } else if (index === 1) {
        return { 'w-20': true }
      } else {
        return { 'w-15': true }
      }
    },
    getWidth (index) {
      if (index === 0 && this.moduleId === 3) {
        return { 'w-10': true }
      } else if (index === 1) {
        return { 'w-20': true }
      } else {
        return { 'w-15': true }
      }
    },
    openDistintaBase () {
      const payload = {
        id: this.data.id,
        item: this.data,
        modal: 'distintabasemodal'
      }
      this.$emit('open-diba-modal', payload)
    },
    getIcon (value) {
      if (typeof value === 'object') {
        return value.icon
      } else {
        const option = this.options.find(option => option.id === value)
        return option ? option.icon : ''
      }
    },
    getOption (value) {
      if (isNaN(Number(value)) && typeof value === 'string') {
        return value
      } else if (isNaN(Number(value)) && typeof value === 'object') {
        const option = this.options.find(option => option.id === value.id)
        if (option) {
          return option.label
        } else {
          return ''
        }
      } else if (!isNaN(Number(value))) {
        const option = this.options.find(option => option.id === value)
        if (option && option) {
          return option.label
        } else {
          return ''
        }
      }
    },
    deleteConfirm () {
      this.$bvModal
        .msgBoxConfirm('Sicuro di voler eliminare?', {
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'SÌ',
          cancelTitle: 'Anulla',
          footerClass: 'p-2'
        })
        .then(value => {
          if (value) {
            this.$emit('delete-item', this.data.id)
          }
        })
        .catch(err => {
          // An error occurred
          console.log('error', err)
        })
    },
    decodeHTML (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    showHeader ({ field, in_list }) {
      if (Number(in_list) > 0) {
        if (field === 'ingredients') {
          return false
        } else if (field === 'actions') {
          return false
        } else if (field === 'categoria_vendita') {
          return false
        } else if (field === 'favorite') {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    toggleItem (event, itemId) {
      this.$emit('toggle-item', event, itemId)
    },
    modifyItem (event, item) {
      this.$emit('modify-item', event, item)
    },
    deleteItem () {},
    copyItem (event, item) {
      this.$emit('copy-item', event, item)
    },

    hrefLink (link, protocolloFile, fileType) {
      if (!link) {
        console.log('No link', protocolloFile)
      }

      let originalLink = link || ''
      let linkFormatted = originalLink.replace(
        '{protocollo_file}',
        protocolloFile
      )
      linkFormatted = fileType
        ? linkFormatted.replace('{tipo_di_file}', fileType.toLowerCase())
        : linkFormatted
      const protocol = location.protocol
      const host = location.hostname
      const entryPoint =
        process.env.NODE_ENV === 'production'
          ? protocol + '//' + host + '/'
          : 'https://peakfood.condivision.cloud/'
      return entryPoint + linkFormatted
    },
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
    }
  },
  computed: {
    isFavorite () {
      return this.data.favorite
    },
    moduleId () {
      return this.$route.params.id
    },
    isPeak () {
      if (this.$store.getters.getHost === 'peakfood.condivision.cloud') {
        return true
      } else {
        return false
      }
    },
    columnWith () {
      const width = Math.floor(100 / this.fields.length)
      return width.toString()
    },
    localFields () {
      let fields = [...this.fields]
      let fieldsSorted = fields.sort((a, b) => (a.in_list > b.in_list) ? 1 : ((b.in_list > a.in_list) ? -1 : 0))
      let calc = (Number(this.data.food_sell_actual) - Number(this.data.food_cost)).toFixed(2)

      if (this.moduleId !== '4') {
        fieldsSorted.push({ field: 'margine', value: String(calc) })
        fieldsSorted.push({ field: 'ingredients' })
      }

      fieldsSorted.push({ field: 'actions' })
      return fieldsSorted
    }
  }
}
</script>

<style>
.modal-backdrop {
  opacity: 0.5;
}
</style>
