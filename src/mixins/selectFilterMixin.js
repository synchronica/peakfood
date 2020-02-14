import axios from 'axios'

export const selectFilterMixin = {
  computed: {
    host () {
      return this.$store.state.host
    }
  },
  methods: {
    async selectFilter (parameters, value) {
      if (parameters.indexOf(',' >= 0)) {
        parameters = parameters.split(',')
        parameters.forEach(async element => {
          const endpoint = `https://${this.host}`
          const res = await axios.get(`${endpoint}/v3.0/?list_values=${element}&listParent=${value}&token=1`)
          const options = await res.data.data
          console.log('selectFilterResponse1', res)
          const { listMaster } = await options[0]
          this.$refs[listMaster][0].options = options
          return options
        })
      } else {
        const endpoint = `https://${this.host}`
        const res = await axios.get(`${endpoint}/v3.0/?list_values=${parameters}&listParent=${value}&token=1`)
        const options = await res.data.data
        console.log('selectFilterResponse2', res)
        const { listMaster } = await options[0]
        this.$refs[listMaster][0].options = options
        return options
      }
    }
  }
}
