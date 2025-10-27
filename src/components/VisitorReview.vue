<template>
  <div class="container">
    <SectionTitle
      titleZh="满意度评价"
      titleEn="Satisfaction Rating"
    ></SectionTitle>
    <GlowBorder>
      <div class="grid">
        <div class="good-value">{{ goodPercentage }}</div>
        <div class="moderate-value">{{ moderatePercentage }}</div>
        <div class="bad-value">{{ badPercentage }}</div>
        <div class="good">
          <div class="good-zh">好评</div>
          <div class="good-en">Good</div>
        </div>
        <div class="moderate">
          <div class="moderate-zh">中评</div>
          <div class="moderate-en">Moderate</div>
        </div>
        <div class="bad">
          <div class="bad-zh">差评</div>
          <div class="bad-en">Bad</div>
        </div>
      </div>
    </GlowBorder>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SectionTitle from "./SectionTitle.vue";
import GlowBorder from "./GlowBorder.vue";

export default {
  name: "VisitorReview",
  components: {
    SectionTitle,
    GlowBorder,
  },
  computed: {
    ...mapGetters(["reviews"]),
    reviewsCount() {
      return this.reviews.good + this.reviews.moderate + this.reviews.bad || 0;
    },
    goodPercentage() {
      return this.reviewsCount === 0
        ? 0
        : ((this.reviews.good / this.reviewsCount) * 100).toFixed(2);
    },
    moderatePercentage() {
      return this.reviewsCount === 0
        ? 0
        : ((this.reviews.moderate / this.reviewsCount) * 100).toFixed(2);
    },
    badPercentage() {
      return this.reviewsCount === 0
        ? 0
        : ((this.reviews.bad / this.reviewsCount) * 100).toFixed(2);
    },
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 8px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "good good-value"
    "moderate moderate-value"
    "bad bad-value";

  align-items: center;
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

.good,
.moderate,
.bad {
  padding-left: 48px;
  align-items: center;
}

.good {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "good-zh"
    "good-en";
  grid-area: good;
  background: left / 40px url("@/assets/icons/review-good.png") no-repeat;
}

.good-en {
  grid-area: good-en;
}

.good-zh {
  grid-area: good-zh;
}

.moderate {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "moderate-zh"
    "moderate-en";
  grid-area: moderate;
  background: left / 40px url("@/assets/icons/review-moderate.png") no-repeat;
}

.moderate-en {
  grid-area: moderate-en;
}

.moderate-zh {
  grid-area: moderate-zh;
}

.bad {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "bad-zh"
    "bad-en";
  grid-area: bad;
  background: left / 40px url("@/assets/icons/review-bad.png") no-repeat;
}

.bad-zh {
  grid-area: bad-zh;
}

.bad-en {
  grid-area: bad-en;
}

[class$="-value"] {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: right;
  &::after {
    content: " %";
  }
}
</style>
