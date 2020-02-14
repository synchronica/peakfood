<template>
  <b-modal
    id="createmodal"
    ref="createmodal"
    title="Aggiungi Nuovo Elemento"
    size="lg"
    body-class="modify-modal"
  >
    <b-form>
      <b-col xs="12" class="ma-0 pa-0 pl-0 pr-0">
        <b-card class="ma-0 py-4" no-body v-if="fields">
          <!-- If tabs exist -->
          <b-tabs v-if="tabs.length > 0" card no-fade>
            <template v-for="(tab, index) in tabs">
              <b-tab
                v-if="tab.type === 'fieldsContainer'"
                :title="tab.label"
                title-item-class="w-50 text-center"
                :key="index"
              >
                <template v-for="({field, type}, index) in localFields">
                  <b-col
                    v-if="field !== 'id' && type !== 'hidden' && type !== 'excluded' && type !== 'invisible' && showField(type) && showInTab(field ,tab.content)"
                    :key="field"
                    sm="12"
                    class="mb-3"
                    :class="{ 'mt-4': index === 0 }"
                  >
                    <label>{{ capitalize(field) }}</label>
                    <b-form-input v-if="type === 'text'" v-model="newItem[field]" />
                    <b-form-input v-if="type === 'float'" v-model="newItem[field]" />
                    <b-form-input v-if="type === 'number'" type="number" v-model="newItem[field]" />
                    <v-select
                      v-if="type === 'select'"
                      :options="selectOptionsArr(field)"
                      v-model="newItem[field]"
                    />
                    <v-date-picker
                      v-if="type === 'date'"
                      mode="single"
                      v-model="newItem[field]"
                      :input-props="{ class:'form-control' }"
                    />
                    <template v-if="type === 'boolean'">
                      <br />
                      <switches v-model="newItem[field]" theme="custom" color="primary" />
                    </template>
                    <v-select
                      v-if="type === 'tags'"
                      taggable
                      multiple
                      :options="selectOptionsArr(field)"
                      v-model="newItem[field]"
                    />

                    <v-select
                      v-if="type === 'selectText'"
                      taggable
                      :options="selectOptionsArr(field)"
                      v-model="newItem[field]"
                    />
                    <b-form-textarea v-if="type === 'textarea'" v-model="newItem[field]" rows="3" />
                  </b-col>
                </template>
              </b-tab>
            </template>
          </b-tabs>

          <!-- If tabs don't exist -->
          <b-form ref="createForm" @submit.prevent="onSubmit" v-else>
            <b-row class="px-4">
              <template
                v-for="({field, type, action, helperText, parameters, className, is_disabled, placeholder, required}) in localFields"
              >
                <b-col
                  v-if="field !== 'protocollo_file'"
                  class="mb-3"
                  sm="12"
                  :class="className"
                  :key="field"
                >
                  <label
                    v-if="field !== 'attrezzatura' && field !== 'tipologia_documento'"
                  >{{ capitalize(field) }}</label>
                  <b-form-input
                    v-if="type === 'text' || type === 'float' || type === 'number'"
                    v-model="newItem[field]"
                    :disabled="is_disabled === '1'"
                    :placeholder="placeholder ? placeholder : ''"
                    :required="required === '1'"
                  />

                  <v-date-picker
                    v-if="type === 'date'"
                    mode="single"
                    v-model="newItem[field]"
                    :input-props="{ class:'form-control' }"
                  />
                  <template v-if="type === 'boolean'">
                    <br />
                    <switches v-model="newItem[field]" theme="custom" color="primary" />
                  </template>

                  <v-select
                    v-if="type === 'tags'"
                    taggable
                    multiple
                    :disabled="is_disabled === '1'"
                    :options="filterOptions(field)"
                    :required="required === '1'"
                    v-model="newItem[field]"
                  />

                  <b-form-select
                    v-else-if="type === 'select'"
                    text-field="label"
                    value-field="id"
                    :ref="field"
                    v-model="newItem[field]"
                    :options="filterOptions(field)"
                    :required="required === '1'"
                    :disabled="is_disabled === '1'"
                  />

                  <label
                    v-if="field === 'attrezzatura' && newItem.categoria_documento === 'TECNICO'"
                  >{{ capitalize(field) }}</label>
                  <b-form-select
                    v-if="field === 'attrezzatura' && newItem.categoria_documento === 'TECNICO'"
                    text-field="label"
                    value-field="label"
                    :ref="field"
                    v-model="newItem[field]"
                    :options="attrezzaturaOptions"
                    :required="required === '1'"
                    :disabled="is_disabled === '1'"
                  />

                  <label
                    v-if="field === 'tipologia_documento' && newItem.categoria_documento"
                  >{{ capitalize(field) }}</label>
                  <b-form-select
                    v-if="field === 'tipologia_documento' && newItem.categoria_documento"
                    text-field="label"
                    value-field="label"
                    :ref="field"
                    v-model="newItem[field]"
                    :options="tipologiaDocumentoOptions"
                    :required="required === '1'"
                    :disabled="is_disabled === '1'"
                  />

                  <b-form-select
                    v-if="type === 'selectText' && field !== 'attrezzatura' && field !== 'tipologia_documento'"
                    text-field="label"
                    value-field="label"
                    :ref="field"
                    v-model="newItem[field]"
                    :options="filterOptions(field)"
                    :required="required === '1'"
                    :disabled="is_disabled === '1'"
                  />

                  <b-form-textarea
                    v-if="type === 'textarea'"
                    :disabled="is_disabled === '1'"
                    v-model="newItem[field]"
                    :placeholder="placeholder ? placeholder : ''"
                    rows="3"
                    :required="required === '1'"
                  />
                  <small v-if="helperText" class="form-text text-muted" v-html="helperText" />
                </b-col>
              </template>
            </b-row>
            <button type="submit" ref="submitBtn" style="display:none"></button>
          </b-form>
        </b-card>
      </b-col>
    </b-form>

    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="handleHideModal">{{ $t('pages.cancel') }}</b-button>
      <b-button variant="primary" @click="handleSubmit" class="mr-1">Invia</b-button>
    </template>
  </b-modal>
</template>
<script>
import vSelect from 'vue-select'
import Switches from 'vue-switches'
import axios from 'axios'
import { instance } from '@/axiosInstance'

export default {
  props: ['item', 'fields', 'tabs', 'selectOptions'],
  components: {
    vSelect,
    Switches
  },
  data: () => ({
    newItem: null,
    fieldsManager: null,
    tipologiaDocumentoOptions: [],
    attrezzaturaOptions: []
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
    this.newItem = this.item
    this.fieldsManager = this.fields
  },
  mounted () {
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (modalId === 'createmodal') {
        if (this.newItem.categoria_documento) {
          this.selectFilter(
            'tipologia_documento',
            this.newItem.categoria_documento
          )
        } else if (this.newItem.categoria_documento === 'TECNICO') {
          this.selectFilter('attrezzatura', this.newItem.categoria_documento)
        }
      }
      // console.log('Modal is about to be shown', bvEvent, modalId)
    })
  },
  computed: {
    moduleId () {
      return this.$route.params.id
    },
    localFields () {
      return this.fields.filter(field => this.showField(field))
    },
    protocolloField () {
      return this.localFields.find(field => field.field === 'protocollo_file')
    },
    host () {
      return this.$store.state.host
    }
  },
  methods: {
    filterOptions (field) {
      return this.selectOptions.filter(option => option.listMaster === field)
    },
    handleSubmit () {
      this.$refs.submitBtn.click()
    },
    onSubmit () {
      this.$emit('create-submit', this.newItem)
    },
    handleHideModal () {
      this.$emit('hide-modal', 'modifymodal')
    },
    showField (fieldObject) {
      const { field, type } = fieldObject

      if (
        field === 'id' ||
        type === 'excluded' ||
        type.includes('hidden') ||
        type === 'excluded' ||
        type === 'invisible' ||
        field === 'categoria_vendita'
      ) {
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
    }
  }
}
</script>
