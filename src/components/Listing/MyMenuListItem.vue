<template>
  <div>
    <template v-if="index === 0 ">
      <div class="d-flex flex-row">
        <div class="pl-1 d-flex w-100">
          <div class="card-body pt-0 align-self-center d-flex flex-column flex-lg-row">
            <template v-for="(field, lIndex) in localFields">
              <div
                class="d-none d-lg-block d-xl-block text-truncate"
                :class="getHeaderWidth(lIndex)"
                :key="field.field"
              >
                <span v-if="field.field === 'categoria_ricetta'">Categoria</span>
                <span v-else-if="field.field === 'food_sell_actual'">Food Sell</span>
                <span
                  v-else-if="field.field === 'tempo_di_preparazione'"
                  v-b-popover.hover.top="'Tempo di Preparazione'"
                >TP</span>
                <span v-else-if="field.field === 'last_sold_total'">Dato di vendita</span>
                <span v-else-if="showHeader(field)">{{ capitalize(field.field) }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <b-card
      class="rounded"
      :class="{'d-flex flex-row':true, 'active' : selectedItems.includes(data.id)}"
      no-body
    >
      <div class="pl-2 d-flex w-100 min-width-zero">
        <div
          class="card-body w-100 w-sm-100 align-self-center d-flex flex-column flex-lg-row align-items-lg-center"
        >
          <template v-for="(field, index) in localFields">
            <div class="w-sm-100 mb-sm-2" :class="getWidth(index)" :key="field.field + field.id">
              <!-- MOBILE HEADER -->
              <span
                v-if="field.field !== 'actions' && field.field !== 'categoria_vendita'"
                class="d-lg-none d-xl-none"
              >{{ capitalize(field.field) }}</span>

              <!-- FIRST ICON OF SALES CLASS -->
              <div
                v-if="field.field === 'sales_class'"
                style="width: 5%"
                class="w-sm-100 mind-icons"
              >
                <i style="font-size: 24px" :class="`glyph-icon ${getIcon(data[field.field])}`" />
              </div>

              <!-- BADGE WITH ICON AND EXTERNAL LINK -->
              <div v-else-if="field.background && field.link === '{link}'" class="w-sm-100">
                <a
                  target="_blank"
                  :href="data[field.field]"
                  class="badge badge-pill"
                  :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
                >
                  <i
                    :class="`mr-1 glyph-icon ${field.icon ? field.icon : 'simple-icon-cloud-download'}`"
                  />
                  <span v-html="decodeHTML(data.nome)" />
                </a>
              </div>

              <!-- NORMAL BADGE -->
              <div
                v-else-if="field.background && field.field !== 'actions' && field.action !== 'fileOpen' && field.field !== 'categoria_vendita'"
                class="w-sm-100"
              >
                <span
                  v-if="field.type === 'select'"
                  class="badge badge-pill"
                  :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
                  v-html="decodeHTML(getOption(data[field.field]))"
                />
                <span
                  v-else-if="field.type === 'selectText'"
                  class="badge badge-pill"
                  :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
                  v-html="decodeHTML(getOption(data[field.field]))"
                />
                <span
                  v-else
                  class="badge badge-pill"
                  :style="{ background: field.background, color: (field.color ? field.color : 'white') }"
                  v-html="decodeHTML(data[field.field])"
                />
              </div>

              <!-- ITEMS THAT REQUIRE OPTIONS LOADED -->
              <p
                v-else-if="field.type === 'select'"
                class="mb-1 text-muted text-small w-sm-100"
                v-html="decodeHTML(getOption(data[field.field]))"
              />
              <p
                v-else-if="field.type === 'selectText'"
                class="mb-1 text-muted text-small w-sm-100"
                v-html="decodeHTML(getOption(data[field.field]))"
              />

              <b-form-input
                v-else-if="field.field === 'last_sold_total'"
                @change="onChange"
                v-model.number="lastSoldTotal"
              />

              <p
                v-else-if="field.field === 'margine'"
                class="mb-1 text-muted text-small w-sm-100"
                :key="field.field + index"
              >{{ field.value }}</p>

              <!-- TEXT ITEMS IN LIST -->
              <p
                v-else-if="field.action !== 'fileOpen' && field.field !== 'favorite' && field.type !== 'selectText' && field.field !== 'actions'"
                class="mb-1 text-muted text-small w-sm-100"
                v-html="decodeHTML(data[field.field])"
              />
            </div>

            <div
              v-if="field.field === 'actions'"
              class="w-sm-100 d-flex justify-content-end flex-grow-1"
              :key="index"
            >
              <div class="custom-control custom-checkbox pl-1 align-self-center ml-2">
                <b-form-checkbox
                  @change="toggleItem($event,data.id)"
                  :checked="selectedItems.includes(data.id)"
                  class="itemCheck mb-0"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import axios from 'axios'
import { listItemMixin } from '@/mixins/listItemMixin'

export default {
  props: ['data', 'selectedItems', 'fields', 'actions', 'options', 'index'],
  mixins: [listItemMixin],
  data () {
    return {
      lastSoldTotal: 0
    }
  },
  methods: {
    getIcon (value) {
      const icons = {
        HH: 'simple-icon-star',
        LH: 'icon-horse',
        HL: 'simple-icon-puzzle',
        LL: 'iconsminds-dog'
      }
      return icons[value]
    },
    async onChange () {
      const formData = new FormData()
      formData.set('id', this.data.id)
      formData.set('last_sold_total', this.lastSoldTotal)

      try {
        const response = await instance.post('/api/AddTotalData')
        console.log('addTotalDataResponse', response)
        if (response.data.data) {
          console.log(response)
        }
      } catch (error) {
        console.log(error)
      }
      // const apiBase = 'https://' + this.$store.getters.getHost + '/v3.0/'
      // const response = await axios
      //   .post(
      //     apiBase + '?add_total_data=' + this.moduleId + '&token=1',
      //     formData,
      //     {
      //       headers: {
      //         'Content-Type': 'multipart/form-data'
      //       }
      //     }
      //   )
      // console.log(response)
    },
    toggleFavorite () {
      this.$emit('handle-favorite', this.data)
    },
    openDistintaBase () {
      const payload = {
        id: this.data.id,
        item: this.data,
        modal: 'distintabasemodal'
      }
      this.$emit('open-diba-modal', payload)
    },
    getHeaderWidth (index) {
      if (index === 0) {
        return { 'w-10': true }
      } else if (index === 1) {
        return { 'w-25': true, 'pl-2': true }
      } else {
        return { 'w-10': true }
      }
    },
    getWidth (index) {
      if (index === 0) {
        return { 'w-10': true }
      } else if (index === 1) {
        return { 'w-25': true }
      } else {
        return { 'w-10': true }
      }
    },
    showHeader ({ field }) {
      if (field === 'ingredients') {
        return false
      } else if (field === 'actions') {
        return false
      } else if (field === 'categoria_vendita') {
        return false
      } else if (field === 'sales_class') {
        return false
      } else if (field === 'favorite') {
        return false
      } else {
        return true
      }
    },
    showField (field) {
      if (field.type.includes('excluded')) {
        return false
      } else {
        return true
      }
    }
  },
  computed: {
    localFields () {
      let fields = [...this.fields]
      fields = fields.filter(
        field => Number(field.in_list) > 0 && this.showField(field)
      )
      let calc = (
        Number(this.data.food_sell_actual) - Number(this.data.food_cost)
      ).toFixed(2)
      fields.push({ field: 'margine', in_list: '6', value: String(calc) })
      fields.push({ field: 'actions', in_list: '9' })
      let fieldsSorted = fields.sort((a, b) =>
        Number(a.in_list) > Number(b.in_list)
          ? 1
          : Number(b.in_list) > Number(a.in_list)
            ? -1
            : 0
      )
      return fieldsSorted
    }
  },
  created () {
    this.lastSoldTotal = this.data.last_sold_total
  }
}
</script>

<style>
.modal-backdrop {
  opacity: 0.5;
}
</style>
