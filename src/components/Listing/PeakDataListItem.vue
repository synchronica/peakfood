<template>
<div>
  <template v-if="index === 0 && isRecettario">
    <div class="d-flex flex-row">
      <div class="pl-2 d-flex flex-grow-1 min-width-zero">
        <div class="card-body px-4 pt-0 w-sm-100 align-self-center d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <template v-for="field in localFields" >
            <div class="d-none d-lg-block d-xl-block w-10 ml-4 text-truncate" :key="field.field">
              <span v-if="showHeader(field.field)">{{ capitalize(field.field) }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>

  <b-card class="rounded" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div class="card-body w-100 w-sm-100 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
        <!-- <template v-for="(field, index) in fields"> -->
        <template v-for="(field, index) in localFields">
          <div v-if="Number(field.in_list) > 0" class="w-sm-100 w-15 mr-3" :key="field.field + field.id">
            <span v-if="isRecettario" class="d-lg-none d-xl-none">{{ capitalize(field.field) }}</span>

            <!-- BADGE WITH ICON AND LINK -->
            <div v-if="Number(field.in_list) > 0 && field.background && field.action === 'fileOpen' && field.link !== '{link}'" class="w-sm-100">
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
            <div v-if="Number(field.in_list) > 0 && field.background && field.link === '{link}'" class="w-sm-100">
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
            <div v-else-if="Number(field.in_list) > 0 && field.background && field.action !== 'fileOpen' && field.field !== 'categoria_vendita'" class="w-sm-100">
              <span v-if="field.type === 'select'" class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(getOption(data[field.field]))" />
              <span v-else-if="field.type === 'selectText'" class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(getOption(data[field.field]))" />
              <span v-else class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(data[field.field])" />
            </div>

            <div
              v-else-if="Number(field.in_list) > 0 && field.background && field.field === 'categoria_vendita'"
              class="w-sm-100 mind-icons"
            >
              <i style="font-size: 24px" :class="`glyph-icon ${getIcon(data[field.field])}`"/>
            </div>

            <!-- OTHER ITEMS IN LIST -->
            <p v-else-if="Number(field.in_list) > 0 && data[field.field] && field.action !== 'fileOpen' && field.type === 'select'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(getOption(data[field.field]))"/>
            <p v-else-if="Number(field.in_list) > 0 && data[field.field] && field.action !== 'fileOpen' && field.type === 'selectText'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(getOption(data[field.field]))"/>
            <p v-else-if="Number(field.in_list) > 0 && data[field.field] && field.action !== 'fileOpen' && field.type !== 'selectText' && field.type !== 'select'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(data[field.field])"/>
          </div>
          <p v-if="field.field === 'margine'" class="mb-1 w-10 text-muted text-small w-sm-100" :key="field.field + index">{{ field.value }}</p>

          <div v-if="field.field === 'ingredients'" class="align-self-center" :key="index">
            <b-btn @click.prevent="openNewModal" variant="primary" class="badge badge-pill">Ingredienti</b-btn>
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
    openNewModal () {
      const payload = {
        id: this.data.id,
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
    showHeader (field) {
      if (field === 'ingredients') {
        return false
      } else if (field === 'actions') {
        return false
      } else if (field === 'categoria_vendita') {
        return false
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
    isRecettario () {
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
      fieldsSorted.push({ field: 'margine', value: String(calc) })
      fieldsSorted.push({ field: 'ingredients' })
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
