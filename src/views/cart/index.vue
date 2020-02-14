<template>
<div>
  <TopNav />
  <main style="margin-left: 0; margin-right: 0;">
    <b-container>
      <b-row>
        <b-col order-md="2" order-cols="1" class="mb-4" cols="12" md="6">
          <b-card
          :title="selectedPlan.name"
          :sub-title="selectedPlan.plan_label"
          class="rounded">
            <hr>
            <b-row>
              <b-col md="10">
                <p>€{{ selectedPlan.plan_price }} x {{ selectedPlan.plan_duration }} months</p>
              </b-col>
              <b-col md=2>
                <p>{{ Number(selectedPlan.plan_price) * Number(selectedPlan.plan_duration) }}€</p>
              </b-col>
            </b-row>
            <template v-slot:footer>
              <b-row>
                <b-col md="10">
                  <h4><strong>Due today</strong></h4>
                </b-col>
                <b-col md=2>
                  <h4><strong>{{ Number(selectedPlan.plan_price) * Number(selectedPlan.plan_duration) }}€</strong></h4>
                </b-col>
              </b-row>
            </template>
          </b-card>
        </b-col>
        <b-col order-md="1" order-cols="2" cols="12" md="6" class="mb-4">
          <b-form>
            <h3 class="mb-4">1. Company info</h3>
            <b-form-group label="Country">
              <b-dropdown text="Choose an option..." variant="outline-secondary">
                <b-dropdown-item>Europe</b-dropdown-item>
                <b-dropdown-item>Extra EU</b-dropdown-item>
              </b-dropdown>
            </b-form-group>
            <b-form-group label="Company name">
              <b-form-input class="rounded" type="email" placeholder="" />
            </b-form-group>

            <b-row>
              <b-col>
                <b-form-group label="Street address">
                  <b-form-input class="rounded" type="email" placeholder="" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Suite / Unit (optional)">
                  <b-form-input class="rounded" type="email" placeholder="" />
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-form-group label="City">
                  <b-form-input class="rounded" type="email" placeholder="" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="State / Province (optional)">
                  <b-form-input class="rounded" type="email" placeholder="" />
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <b-form-group label="Postal code">
                  <b-form-input class="rounded" type="email" placeholder="" />
                </b-form-group>
              </b-col>
            </b-row>

            <hr>

            <h3 class="mb-4">2. Payment method</h3>

            <b-dropdown class="mb-4" text="Choose an option..." variant="outline-secondary">
              <b-dropdown-item>Credit Card</b-dropdown-item>
              <b-dropdown-item>PayPal</b-dropdown-item>
            </b-dropdown>
            <b-container>

              <b-row class="mt-4">
                <b-btn v-if="isSent" @click="handleSetPlan" variant="warning">Proceed with order</b-btn>
                <b-btn v-else @click="handleSetPlan" variant="warning"><b-spinner /></b-btn>
              </b-row>
            </b-container>

          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </main>
</div>
</template>

<script>
import TopNav from '@/containers/TopNav'

export default {
  components: {
    TopNav
  },
  data () {
    return {
      isSent: true
    }
  },
  computed: {
    selectedPlan () {
      return this.$store.state.selectedPlan
    }
  }
}
</script>

<style scoped>
.card-title {
  margin-bottom: .5rem;
}

.card-title {
  margin-bottom: .5rem;
}

.card-header {
  padding: .75rem 1.25rem
}
</style>
