<template>
  <b-modal
    id="menusettingsmodal"
    ref="menusettingsmodal"
    title="Settings"
    size="lg"
    body-class="modify-modal"
  >
    <b-form>
      <b-col xs="12" class="ma-0 pa-0 pl-0 pr-0">
        <b-card class="ma-0 py-4"  no-body v-if="fields">
          <!-- If tabs don't exist -->
          <template v-for="({field, type, helperText}) in fields">
            <b-row
              v-if="field !== 'id' && showField(type) && type !== 'hidden' && type !== 'excluded' && type !== 'invisible'"
              class="px-4"
              :key="field"
            >
              <b-col v-if="field === 'categoria_ricetta'" sm="12" class="mb-3">
                <label>{{ capitalize(field) }}</label>
                <v-select
                  :options="selectOptionsArr(field)"
                  v-model="newItem[field]"
                />

                <small v-if="helperText" class="form-text text-muted" v-html="helperText" />
              </b-col>
            </b-row>
          </template>
        </b-card>
      </b-col>
    </b-form>

    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="handleHideModal"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button
        variant="primary"
        @click="handleSubmit"
        class="mr-1"
      >Invia</b-button>
    </template>
  </b-modal>
</template>
<script>
import vSelect from 'vue-select'

export default {
  props: ['fields', 'selectOptions'],
  components: {
    vSelect
  },
  data: () => ({
    newItem: { categoria_ricetta: null },
    fieldsManager: null,
    dropzoneOptions: {
      url: 'https://httpbin.org/post',
      thumbnailHeight: 160,
      maxFilesize: 2,
      previewTemplate: null,
      headers: { 'My-Awesome-Header': 'header value' }
    }
  }),
  watch: {
    item () {
      this.newItem = this.item
    },
    fields () {
      this.fieldsManager = this.fields
    }
  },
  created () {
    // this.newItem = this.item
    this.fieldsManager = this.fields
    // this.dropzoneOptions.previewTemplate = this.dropzoneTemplate()
  },
  methods: {
    handleSubmit () {
      this.$emit('create-submit', this.newItem)
    },
    handleHideModal () {
      this.$emit('hide-modal', 'menusettingsmodal')
    },
    showField (value) {
      if (value === 'id' || value === 'hidden' || value === 'excluded') {
        return false
      }
      return true
    },
    showInTab (field, content) {
      if (content.includes(field)) {
        return true
      } else {
        return false
      }
    },
    sortOptions () {
      let options = []
      this.fieldsFilter.forEach(field => {
        const label = this.capitalize(field.field)
        const object = { column: field.field, label: label }
        options.push(object)
      })
      return options
    },
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
    },
    selectOptionsArr (field) {
      let options = []
      this.selectOptions.forEach(option => {
        if (option.listMaster === field) {
          options.push(option)
        }
      })
      return options
    },
    dropzoneTemplate () {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `
    }
  }
}
</script>
