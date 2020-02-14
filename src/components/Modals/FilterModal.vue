<template>
  <b-modal
    id="filtermodal"
    ref="filtermodal"
    title="Filtri"
    class="modal-right"
  >
    <b-form>
      <b-row class="mb-3">
        <template v-for="{field, type, in_filter} in fields">
          <b-col v-if="Number(in_filter) > 0 && showField(type)" :key="field" sm="12" class="mb-3">
            <label v-html="capitalize(field)" />
            <b-form-input v-if="type === 'text'" v-model="form[field]"/>
            <b-form-input v-if="type === 'float'" v-model="form[field]"/>
            <b-form-input v-if="type === 'number'" type="number" v-model="form[field]"/>
            <v-select v-if="type === 'select'" :options="filterOptions(field)" v-model="form[field]"/>
            <v-date-picker
              v-if="type === 'date'"
              mode="single"
              v-model="form[field]"
              :input-props="{ class:'form-control' }"
            ></v-date-picker>
            <template v-if="type === 'boolean'">
              <br />
              <switches  v-model="form[field]" theme="custom" color="primary" />
            </template>

              <v-select v-if="type === 'tags'" taggable multiple :options="filterOptions(field)" v-model="form[field]"/>
              <v-select v-if="type === 'selectText'" taggable :options="filterOptions(field)" v-model="form[field]"/>
            <b-form-textarea
              v-if="type === 'textarea'"
              v-model="form[field]"
              rows="3"
            ></b-form-textarea>
          </b-col>
        </template>
      </b-row>
    </b-form>

    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="handleHide"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button
        variant="primary"
        @click="onSubmit"
        class="mr-1"
      >{{ $t('pages.submit') }}</b-button>
    </template>
  </b-modal>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'

export default {
  props: ['item', 'fields', 'selectOptions'],
  components: {
    vSelect
  },
  data () {
    return {
      form: {}
    }
  },
  methods: {
    handleHide () {
      this.$emit('hide-filter-modal', 'filtermodal')
    },
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
    },
    showField (value) {
      if (value.includes('hidden')) {
        return false
      }
      return true
    },
    filterOptions (field) {
      const options = this.selectOptions.filter(option => {
        return option.listMaster === field
      })
      return options
    },
    onSubmit (query) {
      this.$emit('handle-submit', this.form)
    }
  },
  watch: {
    item () {
      this.form = this.item
    }
  },
  created () {
    this.form = this.item
  }
}
</script>
