<template>
  <div class="container">
    <div class="good"></div>
    <div class="moderate"></div>
    <div class="bad"></div>
    <div class="good-value">{{ good }} %</div>
    <div class="moderate-value">{{ moderate }} %</div>
    <div class="bad-value">{{ bad }} %</div>
  </div>
</template>

<script>
export default {
  name: "VisitorReview",
  data() {
    return {
      good: 91,
      moderate: 8,
      bad: 1,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "good moderate bad"
    "good moderate bad"
    "good-value moderate-value bad-value";
}

.good {
  grid-area: good;
  background: center / 40px url("@/assets/icons/review-good.png") no-repeat;
}

.moderate {
  grid-area: moderate;
  background: center / 40px url("@/assets/icons/review-moderate.png") no-repeat;
}

.bad {
  grid-area: bad;
  background: center / 40px url("@/assets/icons/review-bad.png") no-repeat;
}

.good-value {
  grid-area: good-value;
}

.moderate-value {
  grid-area: moderate-value;
}

.bad-value {
  grid-area: bad-value;
}

[class$="-value"] {
  font-size: 1.2rem;
  font-weight: 900;
  color: #4fd2dd;
  text-align: center;
}
</style>
