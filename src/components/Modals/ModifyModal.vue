<template>
  <b-modal
    id="modifymodal"
    ref="modifymodal"
    title="Modifica"
    size="lg"
    body-class="modify-modal"
  >
    <b-form>
      <b-col xs="12" class="ma-0 pa-0 pl-0 pr-0">
        <b-card class="ma-0 py-4"  no-body v-if="fields">

          <!-- If tabs exist -->
          <b-tabs v-if="tabs.length > 0" card no-fade >
            <template v-for="(tab, index) in tabs">
              <b-tab v-if="tab.type === 'fieldsContainer'" :title="tab.label" title-item-class="w-50 text-center" :key="index">
                <template v-for="({field, type, action, helperText, placeholder, is_disabled}, index) in localFields">
                  <b-col
                    v-if="showInTab(field, tab.content)" :key="field"
                    sm="12"
                    class="mb-3"
                    :class="{ 'mt-4': index === 0 }"
                  >
                    <label>{{ capitalize(field) }}</label>

                    <b-form-input v-if="type === 'text'" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>
                    <b-form-input v-if="type === 'float'" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>
                    <b-form-input v-if="type === 'number'" type="number" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>
                    <v-select
                      v-else-if="type === 'select' && field !== 'categoria_vendita'"
                      :disabled="is_disabled === '1'"
                      :options="filterOptions(field)"
                      v-model="modifiedItem[field]"
                    />
                    <v-date-picker
                      v-if="type === 'date'"
                      mode="single"
                      v-model="modifiedItem[field]"
                      :input-props="{ class:'form-control' }"
                    ></v-date-picker>
                    <template v-if="type === 'boolean'">
                      <br />
                      <switches  v-model="modifiedItem[field]" theme="custom" color="primary" />
                    </template>
                    <v-select v-if="type === 'tags'" taggable multiple :options="filterOptions(field)" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>

                    <v-select v-if="type === 'selectText'" taggable :options="filterOptions(field)" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>
                    <b-form-textarea
                      v-if="type === 'textarea'"
                      :disabled="is_disabled === '1'"
                      v-model="modifiedItem[field]"
                      rows="3"
                    ></b-form-textarea>

                    <quill-editor v-if="field.type === 'advance'" ref="myTextEditor"
                      v-model="data[field]"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)" />
                  </b-col>
                </template>
              </b-tab>
            </template>
          </b-tabs>

          <!-- If tabs don't exist -->
          <b-row v-else class="px-4">
            <template v-for="({field, type, action, helperText, parameters, className, is_disabled}) in localFields">
              <b-col v-if="isHidden(type)" class="mb-3" sm="12" :class="className" :key="field">
                <label>{{ capitalize(field) }}</label>

                <b-form-input v-if="type === 'text'" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>
                <b-form-input v-else-if="type === 'float'" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>
                <b-form-input v-else-if="type === 'number'" type="number" v-model="modifiedItem[field]" :disabled="is_disabled === '1'"/>

                <v-date-picker
                  v-if="type === 'date'"
                  mode="single"
                  v-model="modifiedItem[field]"
                  :input-props="{ class:'form-control' }"
                ></v-date-picker>

                <template v-else-if="type === 'boolean'">
                  <br />
                  <switches
                    v-model="modifiedItem[field]"
                    theme="custom"
                    color="primary"
                  />
                </template>

                 <v-select
                  v-if="type === 'tags'"
                  :disabled="is_disabled === '1'"
                  taggable
                  multiple
                  :options="filterOptions(field)"
                  v-model="modifiedItem[field]"
                />

                <v-select
                  v-if="type === 'select'"
                  :disabled="is_disabled === '1'"
                  :options="filterOptions(field)"
                  :reduce="field => field.id"
                  v-model="modifiedItem[field]"
                />
                <v-select
                  v-if="type === 'selectText' && action === 'selectFilter'"
                  :disabled="is_disabled === '1'"
                  :options="filterOptions(field)"
                  :reduce="field => field.label"
                  @input="selectFilter('modifiedItem', parameters, modifiedItem[field])"
                  v-model="modifiedItem[field]"
                />

                <v-select
                  :ref="field"
                  v-else-if="type === 'selectText'"
                  :disabled="is_disabled === '1'"
                  :options="filterOptions(field)"
                  :reduce="field => field.label"
                  v-model="modifiedItem[field]"
                />
                <b-form-textarea
                  v-if="type === 'textarea'"
                  :disabled="is_disabled === '1'"
                  v-model="modifiedItem[field]"
                  rows="3"
                />

                <small v-if="helperText" class="form-text text-muted" v-html="helperText" />
              </b-col>
            </template>
          </b-row>
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
      >Modificare</b-button>
    </template>
  </b-modal>
</template>

<script>
import vSelect from 'vue-select'
import Switches from 'vue-switches'
import { selectFilterMixin } from '@/mixins/selectFilterMixin'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  props: ['item', 'fields', 'tabs', 'selectOptions'],
  mixins: [selectFilterMixin],
  components: {
    vSelect,
    Switches,
    quillEditor
  },
  data: () => ({
    modifiedItem: null,
    fieldsManager: null,
    editorOption: {
      placeholder: '',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' }
          ],
          ['link', 'image'],
          ['clean']
        ]
      }
    }
  }),
  watch: {
    item () {
      this.modifiedItem = this.item
    },
    fields () {
      this.fieldsManager = this.fields
    }
  },
  created () {
    let item = JSON.stringify(this.item)
    this.modifiedItem = JSON.parse(item)
    // this.modifiedItem.description = this.toHtml(this.modifiedItem.description)

    this.fieldsManager = this.fields
  },
  computed: {
    localFields () {
      return this.fields.filter(field => this.showField(field))
    },
    editor () {
      return this.$refs.myTextEditor.quill
    }
  },
  methods: {
    isHidden (type) {
      switch (type) {
        case 'excluded':
          return false
        case 'hidden':
          return false
        case 'hiddenSelect':
          return false
        case 'invisible':
          return false
        default:
          return true
      }
    },
    onEditorBlur (editor) {
      // editor.editor.delta.ops.forEach((element, index) => {
      //   editor.editor.delta.ops[index].insert = this.toHtml(editor.editor.delta.ops[index].insert)
      // })
      console.log('editor blur!', editor)
    },
    onEditorFocus (editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady (editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange ({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.contentBubble = html
    },
    handleSubmit () {
      this.fields.map(field => {
        if (field.type === 'editor') {
          console.log('done', field)
          this.modifiedItem[field.field] = this.modifiedItem[field.field]
        }
      })
      this.$emit('modify-submit', this.modifiedItem)
    },
    handleHideModal () {
      this.$emit('hide-modal', 'modifymodal')
    },
    showField (fieldObject) {
      const { field, type } = fieldObject

      if (field === 'id' || type === 'excluded' || type.includes('hidden') || type === 'excluded' || type === 'invisible' || field === 'categoria_vendita') {
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
    filterOptions (field) {
      return this.selectOptions.filter(option => option.listMaster === field)
    }
  }
}
</script>
