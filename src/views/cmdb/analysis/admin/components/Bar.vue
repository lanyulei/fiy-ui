<template>
  <div>
    <h4 :style="{ marginBottom: '20px', marginTop: '10px' }">{{ title }}</h4>
    <v-chart :force-fit="true" height="250" :data="list" :scale="scale" :padding="padding">
      <v-tooltip :shared="true" />
      <v-axis data-key="type" :label="label" :tick-line="tickLine" />
      <v-interval position="type*value" :label="labelInterval" :opcaity="1" />
      <v-guide
        type="dataMarker"
        :top="true"
        :position="pos"
        content="因政策调整导致销量下滑"
        :style="style"
        :line-length="30"
      />
    </v-chart>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => {}
    },
    scale: {
      type: Array,
      default: () => {
        return [{
          dataKey: 'value',
          alias: '销售额(万)'
        }]
      }
    },
    padding: {
      type: Array,
      default: () => {
        return [20, 20, 30, 50]
      }
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y
          })
        ]
      }
    }
  },
  data() {
    return {
      style: {
        text: {
          fontSize: 13
        }
      },
      label: {
        textStyle: {
          fill: '#aaaaaa'
        }
      },
      tickLine: {
        alignWithLabel: false,
        length: 0
      },
      labelInterval: ['value', {
        useHtml: true,
        htmlTemplate: function htmlTemplate(text, item) {
          var a = item.point
          return '<span class="g2-label-item"><p class="g2-label-item-value">' + a.value + '</p></div>'
        }
      }],
      pos: ['2014-01', 1750]
    }
  },
  mounted() {
    this.setStyle()
  },
  methods: {
    setStyle() {
      const id = 'legend-html'
      if (document.getElementById(id)) {
        return
      }
      const styleTxt = `
          .g2-label-item {
              font-size: 12px;
              text-align: center;
              line-height: 1.5;
          }

          .g2-label-item-value {
              color: #595959;
          }

          .g2-label-item-percent {
              color: #8c8c8c;
          }
        `
      const style = document.createElement('style')
      style.setAttribute('id', id)
      style.innerHTML = styleTxt
      document.getElementsByTagName('head')[0].appendChild(style)
    }
  }
}
</script>
