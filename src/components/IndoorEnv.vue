<template>
  <div class="container">
    <SectionTitle
      titleZh="环境监测"
      titleEn="Indoor Environment"
    ></SectionTitle>
    <GlowBorder>
      <div class="grid">
        <div class="temp">
          <div class="temp-zh">温度</div>
          <div class="temp-en">Temperature</div>
        </div>
        <div class="humid">
          <div class="humid-zh">湿度</div>
          <div class="humid-en">Humidity</div>
        </div>
        <div class="NH3">
          <div class="NH3-zh">氨气</div>
          <div class="NH3-en">Ammonia</div>
        </div>
        <div class="PM-2-5">
          <div class="PM-2-5-zh">PM2.5</div>
          <div class="PM-2-5-en">Particulate Matter 2.5</div>
        </div>
        <div class="temp-value">{{ temp || "-" }} ℃</div>
        <div class="humid-value">{{ humid || "-" }} %</div>
        <div class="NH3-value">{{ NH3 || "-" }} ppm</div>
        <div class="PM-2-5-value">{{ PM25 || "-" }} ppm</div>
      </div>
    </GlowBorder>
  </div>
</template>

<script>
import SectionTitle from "./SectionTitle.vue";
import GlowBorder from "./GlowBorder.vue";

export default {
  name: "IndoorEnv",
  components: {
    SectionTitle,
    GlowBorder,
  },
  data() {
    return {
      temp: "",
      humid: "",
      NH3: "",
      PM25: "",
      tbWsListener: null,
    };
  },
  mounted() {
    // 监听ThingsBoard Edge推送
    this.tbWsListener = {
      onmessage: (data) => {
        const parseValue = (arr, type) => {
          if (!Array.isArray(arr) || arr.length === 0) return undefined;
          const val = Number(arr[0][1]);
          switch (type) {
            case "temp":
              return (val / 100 - 20).toFixed(2);
            case "humid":
              return (val / 100).toFixed(2);
            case "NH3":
            case "pm_2.5":
              return (val / 1000).toFixed(3);
            default:
              return val;
          }
        };
        if (data && data.data) {
          if (data.data.temp !== undefined)
            this.temp = parseValue(data.data.temp, "temp");
          if (data.data.humid !== undefined)
            this.humid = parseValue(data.data.humid, "humid");
          if (data.data.NH3 !== undefined)
            this.NH3 = parseValue(data.data.NH3, "NH3");
          if (data.data["pm_2.5"] !== undefined)
            this.PM25 = parseValue(data.data["pm_2.5"], "pm_2.5");
        }
      },
    };
    this.$tbWs.addListener(this.tbWsListener);
  },
  beforeDestroy() {
    if (this.tbWsListener) {
      this.$tbWs.removeListener(this.tbWsListener);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 45vw;
}

.grid {
  padding: 0 2vw;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 8px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "temp temp-value"
    "humid humid-value"
    "PM-2-5 PM-2-5-value"
    "NH3 NH3-value";

  .temp-value {
    grid-area: temp-value;
  }

  .humid-value {
    grid-area: humid-value;
  }

  .PM-2-5-value {
    grid-area: PM-2-5-value;
  }

  .NH3-value {
    grid-area: NH3-value;
  }

  .temp,
  .humid,
  .PM-2-5,
  .NH3 {
    padding-left: 12px;
    align-items: center;
    position: relative;

    &::before {
      content: "";
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      border-radius: 50%;
      position: absolute;
      left: -24px;
      background-color: #3774d0;
    }
  }

  .temp {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "temp-zh"
      "temp-en";
    grid-area: temp;

    .temp-zh {
      grid-area: temp-zh;
    }

    .temp-en {
      grid-area: temp-en;
    }
  }

  .humid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "humid-zh"
      "humid-en";
    grid-area: humid;

    .humid-zh {
      grid-area: humid-zh;
    }

    .humid-en {
      grid-area: humid-en;
    }

    &::before {
      background-color: #5fc1f1;
    }
  }

  .PM-2-5 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "PM-2-5-zh"
      "PM-2-5-en";
    grid-area: PM-2-5;

    .PM-2-5-zh {
      grid-area: PM-2-5-zh;
    }

    .PM-2-5-en {
      grid-area: PM-2-5-en;
    }

    &::before {
      background-color: #71eee6;
    }
  }

  .NH3 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "NH3-zh"
      "NH3-en";
    grid-area: NH3;

    .NH3-zh {
      grid-area: NH3-zh;
    }

    .NH3-en {
      grid-area: NH3-en;
    }

    &::before {
      background-color: #d99f3b;
    }
  }

  [class$="-value"] {
    font-size: 1.2rem;
    color: #4fd2dd;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
