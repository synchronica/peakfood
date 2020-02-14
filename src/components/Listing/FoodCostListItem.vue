<template>
<div>
  <template v-if="index === 0 ">
    <div class="d-flex flex-row">
      <div class="pl-2 d-flex w-100">
        <div style="padding-left:24px" class="card-body pt-0 align-self-center d-flex flex-column flex-lg-row">
          <template v-for="(field, lIndex) in localFields">
            <div v-if="field.field !== 'sales_class'" class="d-none d-lg-block d-xl-block text-truncate" :class="getHeaderWidth(lIndex)" :key="field.field">
              <span v-if="field.field === 'categoria_ricetta'">Categoria</span>
              <span v-else-if="field.field === 'food_sell_actual'">
                Food Sell
              </span>
              <span v-else-if="field.field === 'tempo_di_preparazione'" v-b-popover.hover.top="'Tempo di Preparazione'">
                TP
              </span>
              <span v-else-if="showHeader(field)">{{ capitalize(field.field) }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>

  <b-card class="rounded" :class="{'d-flex flex-row':true, 'active' : selectedItems.includes(data.id)}" no-body>
    <div class="pl-2 d-flex w-100 min-width-zero">
      <div class="card-body w-100 w-sm-100 align-self-center d-flex flex-column flex-lg-row align-items-lg-center">
        <template v-for="(field, index) in localFields">
          <div v-if="data[field.field] && field.field !== 'sales_class'" class="w-sm-100" :class="getWidth(index)" :key="field.field + field.id">

            <!-- MOBILE HEADER -->
            <span v-if="field.field !== 'favorite'" class="d-lg-none d-xl-none">{{ capitalize(field.field) }}</span>

            <!-- FAVORITE SWITCH -->
            <div v-if="field.field === 'favorite'" class="w-sm-100 mind-icons" @click="toggleFavorite">
              <i style="font-size: 24px; cursor: pointer; color:red;" class="glyph-icon" :class="{'icon-heart': data.favorite == 0, 'icon-heart1': data.favorite == 1}"/>
            </div>

            <!-- BADGE WITH ICON AND EXTERNAL LINK -->
            <div v-else-if="field.background && field.link === '{link}'" class="w-sm-100">
              <a
                target="_blank"
                :href="data[field.field]"
                class="badge badge-pill"
                :style="{ background: field.background, color: (field.color ? field.color : 'white') }">
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

            <!-- TEXT ITEMS IN LIST -->
            <a
              style="cursor: pointer;"
              v-else-if="field.action !== 'fileOpen' && field.field !== 'favorite' && field.type !== 'selectText'"
              @click.prevent="openDistintaBase">
              <p class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(data[field.field])"/>
            </a>

            <p v-else-if="field.action !== 'fileOpen' && field.field !== 'favorite' && field.type !== 'selectText'" class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(data[field.field])"/>
          </div>
          <p v-if="field.field === 'margine'" class="mb-1 w-10 text-muted text-small w-sm-100" :key="field.field + index">{{ field.value }}</p>

          <div v-if="field.field === 'ingredients'" class="w-10 align-self-left" :key="index">
            <b-btn @click.prevent="openDistintaBase" variant="primary" class="badge badge-pill">Ingredienti</b-btn>
          </div>

          <div v-if="field.field === 'actions'" class="w-sm-100 d-flex flex-grow-1 justify-content-end" :key="index" :class="`w-10`">
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
import { listItemMixin } from '@/mixins/listItemMixin'
export default {
  props: ['data', 'selectedItems', 'fields', 'actions', 'options', 'index'],
  mixins: [listItemMixin],
  methods: {
    toggleFavorite () {
      this.$emit('handle-favorite', this.data)
    },
    openDistintaBase () {
      const payload = {
        id: this.data.market_recipe_id,
        item: this.data,
        modal: 'distintabasemodal'
      }
      this.$emit('open-diba-modal', payload)
    },
    getHeaderWidth (index) {
      if (index === 2) {
        return { 'w-15': true }
      }
      if (index === 1) {
        return { 'w-10': true }
      } else {
        return { 'w-10': true }
      }
    },
    getWidth (index) {
      if (index === 2) {
        return { 'w-15': true, 'pr-4': true }
      }
      if (index === 1) {
        return { 'w-10': true }
      } else {
        return { 'w-10': true, 'pr-4': true }
      }
    },
    showHeader ({ field }) {
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
    },
    showField (field) {
      if (field.field !== 'categoria_vendita') {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    isFavorite () {
      return this.data.favorite
    },
    localFields () {
      let fields = [...this.fields]
      fields = fields.filter(field => {
        if (field.field === 'favorite') {
          return field
        }
        if (field.field === 'categoria_vendita') {
          return
        }
        if (field.field === 'last_sold_total') {
          return
        }
        if (Number(field.in_list) > 0) {
          return field
        }
      })
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
