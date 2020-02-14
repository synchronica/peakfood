export const listItemMixin = {
  data: () => ({
    boxOne: ''
  }),
  methods: {
    getHeaderWidth (index) {
      if (index === 0) {
        return { 'w-10': true }
      } else if (index === 1) {
        return { 'w-20': true }
      } else {
        return { 'w-15': true }
      }
    },
    getWidth (index) {
      if (index === 0) {
        return { 'w-10': true }
      } else if (index === 1) {
        return { 'w-20': true }
      } else {
        return { 'w-10': true }
      }
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
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
    }
  },
  computed: {
    moduleId () {
      return this.$route.params.id
    },
    columnWith () {
      const width = Math.floor(100 / this.fields.length)
      return width.toString()
    }
  },
  watch: {
    '$route' () {
      this.setLocalFields()
    }
  }

}
