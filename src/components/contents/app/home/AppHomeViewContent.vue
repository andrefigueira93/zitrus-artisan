<template>
  <v-card flat color="transparent">
    <v-card-title>
      <h1 class="capitalize">Olá, {{ user?.username }}</h1>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          v-for="(chart, i) in charts"
          :key="i"
          class="col-12 col-sm-6 mt-10"
        >
          <v-card class="rounded-lg">
            <v-sheet
              class="v-sheet--offset mx-auto rounded-lg"
              color="green"
              elevation="12"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="chart.labels"
                :value="chart.value"
                :gradient="['#99d504', '#99d504', '#fff']"
                line-width="3"
                color="white"
                smooth="12"
                padding="16"
              ></v-sparkline>
            </v-sheet>
            <v-card-text class="pt-0">
              <div class="text-h6 font-weight-light mb-2">
                {{ chart.title }}
              </div>
              <v-divider class="my-2"></v-divider>
              <v-icon class="mr-2" small> {{ chart.icon }} </v-icon>
              <span class="text-caption">
                {{ chart.subtitle }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="col-12 col-sm-6 mt-10 pa-0 ma-0">
          <Doughnut :data="chartData" :options="chartOptions" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { meses, randomInt, toCurrency } from "@/helpers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "AppHomeViewContent",
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  components: {
    Doughnut,
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    totalEntregas() {
      return this.charts.reduce((acc, chart) => {
        return acc + chart.value.reduce((acc, value) => acc + value, 0);
      }, 0);
    },
    charts() {
      const novosClientesValue = meses.map((m, i) => {
        const mesAtual = new Date().getMonth();
        if (i <= mesAtual) {
          return randomInt(8, 100);
        }
      });
      const entregasValue = meses.map((m, i) => {
        const mesAtual = new Date().getMonth();
        if (i <= mesAtual) {
          return randomInt(8, 100);
        }
      });
      const faturamentoValue = meses.map((m, i) => {
        const mesAtual = new Date().getMonth();
        if (i <= mesAtual) {
          return randomInt(8, 100);
        }
      });
      const mediaDeNovosClientesPorMes = Math.round(
        novosClientesValue.reduce((acc, value) => acc + value, 0) /
          novosClientesValue.length
      );
      const mediaDeEntregasPorMes = Math.round(
        entregasValue.reduce((acc, value) => acc + value, 0) /
          entregasValue.length
      );
      const mediaFaturamentoPorMes = toCurrency(
        Math.round(
          faturamentoValue.reduce((acc, value) => acc + value, 0) /
            faturamentoValue.length
        )
      );
      const totalClientes = novosClientesValue.reduce(
        (acc, value) => acc + value,
        0
      );
      const totalEntregas = entregasValue.reduce(
        (acc, value) => acc + value,
        0
      );
      const totalFaturamento = toCurrency(
        faturamentoValue.reduce((acc, value) => acc + value)
      );
      return [
        {
          title: "Novos clientes",
          labels: meses,
          value: novosClientesValue,
          icon: "mdi-account",
          subtitle: `Registros de clientes no mês - Média de ${mediaDeNovosClientesPorMes} clientes por mês - Total de ${totalClientes} clientes`,
        },
        {
          title: "Entregas",
          labels: meses,
          value: entregasValue,
          icon: "mdi-truck-delivery",
          subtitle: `Registros de entregas no mês - Média de ${mediaDeEntregasPorMes} entregas por mês - Total de ${totalEntregas} entregas`,
        },
        {
          title: "Faturamento",
          labels: meses,
          value: faturamentoValue,
          icon: "mdi-cash-multiple",
          subtitle: `Faturamento no mês - Média de ${mediaFaturamentoPorMes} em faturamento por mês - Total de ${totalFaturamento}`,
        },
      ];
    },
    chartData() {
      return {
        labels: ["Entregas", "Clientes", "Faturamento"],
        datasets: [
          {
            data: [
              this.charts[0].value.reduce((acc, value) => acc + value, 0),
              this.charts[1].value.reduce((acc, value) => acc + value, 0),
              this.charts[2].value.reduce((acc, value) => acc + value, 0),
            ],
            backgroundColor: ["#99d504", "#4caf50", "#8bc34a"],
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
