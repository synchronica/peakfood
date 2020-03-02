<template>
  <div>
    <div v-if="isLoad === false" class="loading"></div>
    <template v-show="isLoad">
      <b-row>
        <b-colxx xxs="12">
          <piaf-breadcrumb :heading="$t('menu.content')"/>
          <div class="separator mb-5"></div>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx xl="6" lg="12">
          <div class="icon-cards-row">
            <swiper :options="swiperIconsOption" ref="swiperIcons" >
              <!-- <template v-if="isPeakFood === false"> -->
                <swiper-slide v-for="counter in counters" :key="counter.tipo2 || counter.tipo1">
                  <router-link :to="counter.link">
                    <icon-card @click="goTo(counter.link)" :title="counter.tipo2 || counter.tipo1" icon="iconsminds-file" :value="Number(counter.tot)" />
                  </router-link>
                </swiper-slide>
              <!-- </template>
              <template v-else>
                <swiper-slide>
                  <icon-card :title="$t('dashboards.pending-orders')" icon="iconsminds-clock" :value=14 />
                </swiper-slide>
                <swiper-slide>
                  <icon-card :title="$t('dashboards.completed-orders')" icon="iconsminds-basket-coins" :value=32 />
                </swiper-slide>
                <swiper-slide>
                  <icon-card :title="$t('dashboards.refund-requests')" icon="iconsminds-arrow-refresh" :value=74 />
                </swiper-slide>
                <swiper-slide>
                  <icon-card :title="$t('dashboards.new-comments')" icon="iconsminds-mail-read" :value=25 />
                </swiper-slide>
              </template> -->
          </swiper>
          <resize-observer @notify="handleSwipersResize"/>
          </div>
          <template v-if="isPeakFood">
            <b-row>
              <b-colxx md="12">
              <b-card class="rounded mb-4 dashboard-quick-post" :title="$t('dashboards.quick-post')">
                <b-refresh-button @click="refreshButtonClick"/>
                <b-form @submit.prevent="quickPostSubmit">
                  <b-form-group horizontal label-cols="3" breakpoint="sm" :label="$t('dashboards.title')">
                    <b-form-input v-model="quickPost.title" :placeholder="$t('dashboards.title')"></b-form-input>
                  </b-form-group>
                  <b-form-group horizontal label-cols="3" breakpoint="sm" :label="$t('dashboards.content')">
                    <b-textarea  v-model="quickPost.content" :placeholder="$t('dashboards.content')" :rows="4" :max-rows="4"/>
                  </b-form-group>
                  <b-form-group horizontal label-cols="3" breakpoint="sm" :label="$t('dashboards.category')">
                      <v-select  :options="selectData" :dir="direction"/>
                  </b-form-group>
                  <b-button type="submit" variant="primary" class="float-right">{{ $t('dashboards.save-and-publish') }}</b-button>
                </b-form>
              </b-card>
              </b-colxx>
            </b-row>
          </template>
          <template v-else>
            <b-row>
              <b-colxx md="12">
              <b-card class="rounded mb-4 dashboard-quick-post" title="Nuovo Intervento">
                <!-- <b-refresh-button @click="refreshButtonClick"/> -->
                <b-form @submit.prevent="submitNuovoIntervento">
                  <b-form-group horizontal label-cols="3" breakpoint="sm" label="Nome">
                    <b-form-input v-model="nuovoIntervento.nome"></b-form-input>
                  </b-form-group>
                  <b-form-group horizontal label-cols="3" breakpoint="sm" label="Descrizione">
                    <b-textarea  v-model="nuovoIntervento.descrizione" :rows="4" :max-rows="4"/>
                  </b-form-group>
                  <b-form-group horizontal label-cols="3" breakpoint="sm" label="Categoria">
                    <v-select  :options="selectData" v-model="nuovoIntervento.categoria" :dir="direction"/>
                  </b-form-group>
                  <b-button type="submit" variant="primary" class="float-right">{{ $t('dashboards.save-and-publish') }}</b-button>
                </b-form>
              </b-card>
              </b-colxx>
            </b-row>
          </template>
        </b-colxx>

      <b-colxx lg="12" xl="6">
        <b-card class="rounded data-table" :title="tableTitle">
          <b-table hover :items="tableData" :fields="fields">
            <template v-slot:cell(sottocategoria)="data">
              <router-link
                :to="`/app/documenti/2?sottocategoria_documento=${data.value}`">
                <a>
                  <span>{{ data.value }}</span>
                </a>
              </router-link>
            </template>
          </b-table>
          <!-- <vuetable v-if="isLoad" ref="vuetable"
            :data="tableData"
            :api-mode="false"
            :fields="fields"
            :per-page="6"
          ></vuetable> -->
          <!-- <vuetable-pagination-bootstrap ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          ></vuetable-pagination-bootstrap> -->
        </b-card>
      </b-colxx>

      <!-- <b-colxx lg="12" xl="6">
        <b-card class="rounded" :title="$t('dashboards.top-viewed-posts')">
          <vuetable ref="vuetable"
            :api-url="bestsellers.apiUrl"
            :fields="bestsellers.fields"
            :per-page="6"
            pagination-path=""
            @vuetable:pagination-data="onPaginationData"
          ></vuetable>
          <vuetable-pagination-bootstrap ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          ></vuetable-pagination-bootstrap>
        </b-card>
      </b-colxx> -->
    </b-row>
    <template v-if="isPeakFood">
    <b-row>
      <b-colxx lg="4" md="6" class="mb-4">
        <b-card :title="$t('dashboards.cakes')" class="rounded dashboard-link-list">
          <two-column-list :data="cakes"/>
        </b-card>
      </b-colxx>

      <b-colxx lg="8" md="12" class="mb-4">
        <b-card :title="$t('dashboards.new-comments')" class="rounded dashboard-link-list">
          <vue-perfect-scrollbar class="scroll dashboard-list-with-user" :settings="{ suppressScrollX: true, wheelPropagation: false }">
              <list-with-user-item v-for="(item, index) in comments" :data="item" detail-path="/app/pages/details" :key="index"/>
            </vue-perfect-scrollbar>
        </b-card>
      </b-colxx>
    </b-row>

    <b-row>
      <b-colxx sm="12" md="6" class="mb-4">
        <b-card class="rounded dashboard-filled-line-chart" no-body>
          <b-card-body>
            <div class="float-left float-none-xs">
            <div class="d-inline-block">
              <h5 class="d-inline">{{ $t('dashboards.website-visits') }}</h5>
              <span class="text-muted text-small d-block">{{ $t('dashboards.unique-visitors') }}</span>
            </div>
          </div>
            <b-dropdown id="ddown5" :text="$t('dashboards.this-week')" size="xs" variant="outline-primary" class="float-right float-none-xs mt-2">
                <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
                <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
            </b-dropdown>
          </b-card-body>
          <div class="chart card-body pt-0">
            <area-shadow-chart :data="areaChartData" :height="195"/>
          </div>
        </b-card>
      </b-colxx>
      <b-colxx sm="12" md="6" class="mb-4">
        <b-card class="rounded dashboard-filled-line-chart" no-body>
          <b-card-body>
            <div class="float-left float-none-xs">
            <div class="d-inline-block">
              <h5 class="d-inline">{{ $t('dashboards.conversion-rates') }}</h5>
              <span class="text-muted text-small d-block">{{ $t('dashboards.per-session') }}</span>
            </div>
            </div>
              <b-dropdown id="ddown5" :text="$t('dashboards.this-week')" size="xs" variant="outline-secondary" class="float-right float-none-xs mt-2">
                  <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
                  <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
              </b-dropdown>
            </b-card-body>
            <div class="chart card-body pt-0">
              <area-shadow-chart :data="conversionChartData" :height="195"/>
            </div>
          </b-card>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx lg="4" class="mb-4">
          <gradient-with-radial-progress-card
            icon="iconsminds-clock"
            :title="`5 ${$t('dashboards.posts')}`"
            :detail="$t('dashboards.pending-for-publish')"
            :percent="5*100/12"
            progressText="5/12"
          />
        </b-colxx>
        <b-colxx lg="4" class="mb-4">
          <gradient-with-radial-progress-card
            icon="iconsminds-male"
            :title="`4 ${$t('dashboards.users')}`"
            :detail="$t('dashboards.on-approval-process')"
            :percent="4*100/6"
            progressText="4/6"
          />
        </b-colxx>
        <b-colxx lg="4" class="mb-4">
          <gradient-with-radial-progress-card
            icon="iconsminds-bell"
            :title="`8 ${$t('dashboards.alerts')}`"
            :detail="$t('dashboards.waiting-for-notice')"
            :percent="8*100/10"
            progressText="8/10"
          />
        </b-colxx>
      </b-row>
    </template>
    </template>
  </div>
</template>
<script>
import { ResizeObserver } from 'vue-resize'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '@/components/Common/VuetablePaginationBootstrap'

import IconCard from '@/components/Cards/IconCard'
import GradientWithRadialProgressCard from '@/components/Cards/GradientWithRadialProgressCard'
import AreaShadowChart from '@/components/Charts/AreaShadow'

import { areaChartData, conversionChartData } from '@/data/charts'
import cakes from '@/data/cakes'
import comments from '@/data/comments'
import { getDirection } from '@/utils'
import { apiUrl } from '@/constants/config'

export default {
  components: {
    IconCard,
    swiper,
    swiperSlide,
    ResizeObserver,
    vSelect,
    Vuetable,
    VuetablePaginationBootstrap,
    AreaShadowChart,
    GradientWithRadialProgressCard
  },
  data () {
    return {
      apiBase: null,
      nuovoIntervento: {
        nome: null,
        descrizione: null,
        categoria: 'Attrezzature'
      },
      isLoad: false,
      counters: [],
      swiperIconsOption: {
        slidesPerView: 4,
        breakpoints: {
          0: { slidesPerView: 1 },
          320: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          1800: { slidesPerView: 3 }
        }
      },
      selectData: [
        { label: 'Chocolate', value: 'chocolate' },
        { label: 'Vanilla', value: 'vanilla' },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Caramel', value: 'caramel' },
        { label: 'Cookies and Cream', value: 'cookiescream' },
        { label: 'Peppermint', value: 'peppermint' }
      ],
      quickPost: {
        title: '',
        content: '',
        category: ''
      },
      direction: getDirection().direction,
      areaChartData,
      conversionChartData,
      cakes,
      comments,
      tableTitle: null,
      fields: null,
      tableData: [],
      bestsellers: {
        apiUrl: apiUrl + '/cakes/fordatatable',
        fields: [{
          name: 'title',
          sortField: 'title',
          title: 'Name',
          titleClass: '',
          dataClass: 'list-item-heading'
        }, {
          name: 'sales',
          sortField: 'sales',
          title: 'Sales',
          titleClass: '',
          dataClass: 'text-muted'
        }, {
          name: 'stock',
          sortField: 'stock',
          title: 'Stock',
          titleClass: '',
          dataClass: 'text-muted'
        }, {
          name: 'category',
          sortField: 'category',
          title: 'Category',
          titleClass: '',
          dataClass: 'text-muted'
        }]
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.handleSwipersResize()
    }, 50)
  },
  computed: {
    axios () {
      return this.$store.getters.getAxios
    },
    host () {
      return this.$store.getters.getHost
    },
    isPeakFood () {
      if (this.host === 'peakfood.condivision.cloud') {
        return true
      }
      return false
    }
  },
  methods: {
    // goTo (link) {
    //   this.$router.push(link)
    // },
    refreshButtonClick () {
      console.log('refreshButtonClick')
    },
    handleSwipersResize () {
      this.$refs.swiperIcons.update()
    },
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    quickPostSubmit () {
      console.log(this.quickPost)
    },
    async getCounters () {
      const response = await this.axios.post('/api/GetCounters')
      console.log('counters', response)
      const data = await response.data.data
      this.counters = data
    },
    submitNuovoIntervento () {
      this.insertUpdate(this.nuovoIntervento)
    },
    insertUpdate (item, copy = false) {
      const formData = new FormData()
      const object = {}
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          let element = item[key]
          if (key === 'id' && element === '') {
            element = 0
          }
          if (element.label) {
            element = element.label
          }

          if (typeof element === 'object') {
            let string = ''
            element.forEach((property, index) => {
              if (typeof property === 'string') {
                string += `{${property}}`
              } else {
                string += `{${property.id}}`
              }
              if (index + 1 < element.length) {
                string += ','
              }
            })
            element = string
          }

          formData.set(key, element)
          object[key] = element
        }
      }
      formData.set('id', 0)
      console.log('Object Sent: ', object)
      // axios
      //   .post(
      //     this.apiBase + '?update=5&token=1' + (copy ? '&copy' : ''),
      //     formData,
      //     {
      //       headers: {
      //         'Content-Type': 'multipart/form-data'
      //       }
      //     }
      //   )
      //   .then(response => {
      //     const status = response.data.status
      //     const data = response.data.data
      //     console.log('Ajax Response: ', response)
      //     if (status) {
      //       // const recordId = data.recordId
      //       const type = 'success filled'
      //       const title = 'Successo'
      //       const message = 'Nuovo Intervento aggiunto'
      //       this.$notify(type, title, message, { duration: 3000, permanent: false })
      //     } else {
      //       const type = 'error filled'
      //       const title = 'C\'è stato un problema'
      //       const message = data.data.message
      //       this.$notify(type, title, message, { duration: 3000, permanent: false })
      //     }
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   })
    },
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
    },
    async getTableContent () {
      const response = await this.axios.post('/api/WDataReport')
      console.log('WDataReport', response)
      const data = await response.data.data
      let fields = []
      // for (const field of data) {
      //
      for (const key in data[0]) {
        const obj = {
          name: '',
          sortField: '',
          title: '',
          titleClass: '',
          dataClass: 'text-muted'
        }
        if (data[0].hasOwnProperty(key)) {
          obj.name = key
          obj.sortField = key
          obj.title = this.capitalize(key)
        }
        fields.push(obj)
      }
      this.tableTitle = response.data.widget_title
      this.fields = fields
      this.tableData = data
      // }
      console.log('getTableContent', data)
      console.log('fields', fields)
      this.isLoad = true
    }
  },
  created () {
    this.apiBase = 'https://' + this.$store.getters.getHost + '/v3.0/'
    this.getCounters()
    this.getTableContent()
  }
}
</script>

<style scoped>
.data-table {
  max-height: 600px;
  overflow: auto;
}
</style>
