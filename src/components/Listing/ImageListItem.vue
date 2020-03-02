<template>
    <b-card class="rounded" :class="{'active' : selectedItems.includes(data.id)}" no-body>
        <div class="position-relative">
            <router-link :to="`?p=${data.img_ricetta}`" class="w-40 w-sm-100">
                <img :src="data.img_ricetta" class="rounded card-img-top" :alt="data.title"/>
            </router-link>
            <b-badge pill :variant="data.statusColor" class="position-absolute badge-top-left">{{ data.status }}</b-badge>
        </div>
        <b-card-body>
            <b-row>
                <b-colxx xxs="12" class="mb-0">
                  <b-row class="mb-2" align-v="center">
                    <b-col xs="3">
                      <b-form-checkbox @click.prevent="toggleItem($event,data.id)" :checked="selectedItems.includes(data.id)" class="itemCheck"/>
                    </b-col>
                    <template v-for="action in actions">
                      <b-col xs="3" v-if="action === 'modify'" class="pl-1 align-self-center pr-4" :key="action">
                        <a @click.prevent="modifyItem($event, data, false)" v-b-tooltip.hover :title="capitalize(action)">
                          <i  :class="'glyph-icon simple-icon-note'"/>
                        </a>
                      </b-col>
                      <b-col xs="3" v-if="action === 'copy'" class="pl-1 align-self-center pr-4" :key="action">
                        <a @click.prevent="copyItem($event, data)" v-b-tooltip.hover :title="capitalize(action)">
                          <i  :class="'glyph-icon simple-icon-docs'"/>
                        </a>
                      </b-col>
                      <b-col xs="3" v-if="action === 'delete'" class="pl-1 align-self-center pr-4" :key="action">
                        <a v-b-tooltip.hover :title="capitalize(action)">
                          <i  :class="'glyph-icon simple-icon-trash'"/>
                        </a>
                      </b-col>
                      <b-col xs="3" v-if="action === 'print'" class="pl-1 align-self-center pr-4" :key="action">
                        <a v-b-tooltip.hover :title="capitalize(action)">
                          <i  :class="'glyph-icon simple-icon-printer'"/>
                        </a>
                      </b-col>
                    </template>
                  </b-row>

                    <template v-for="(field, index) in filters">

                        <!-- BADGE WITH ICON AND EXTERNAL LINK -->
                        <div v-if="Number(field.in_list) > 0 && field.background && field.link === '{link}'" class=" w-sm-100" :key="index">
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
                        <div v-else-if="Number(field.in_list) > 0 && field.background" class="w-sm-100" :key="index">
                          <span class="badge badge-pill" :style="{ background: field.background, color: (field.color ? field.color : 'white') }" v-html="decodeHTML(data[field.field])" />
                        </div>

                        <!-- FIRST ITEM IN LIST -->
                        <!-- <p v-else-if="field.in_list === '1'" class="mb-1 text-muted text-small w-sm-100" :class="`w-${columnWith}`" :key="field.field" v-html="decodeHTML(data[field.field])"/> -->

                        <!-- OTHER ITEMS IN LIST -->
                        <p v-else-if="Number(field.in_list) > 0 && data[field.field]" class="mb-1 text-muted text-small w-sm-100" :key="field.field" v-html="decodeHTML(data[field.field])"/>
                    </template>
                </b-colxx>
            </b-row>
        </b-card-body>
    </b-card>
</template>
<script>
export default {
  props: ['data', 'selectedItems', 'filters', 'actions'],
  methods: {
    labelShow (field) {
      if (field === 'nome' || field === 'portata') {
        return false
      } else {
        return true
      }
    },
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
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/, ' ')
    }
  }
}
</script>

<style scoped>
.rounded {
  border-radius: .75rem !important;
}
</style>
