export default {
  data() {
    return {
      intervals: [],
    };
  },
  mounted() {
    const elements = [this.$el].concat(Object.values(this.$refs));

    elements.forEach((el, ind) => {
      if (!el.getBoundingClientRect) {
        return;
      }
      this.intervals[ind] = setInterval(() => {
        const bounding = el.getBoundingClientRect();
        const minScroll =
          (window.innerHeight || document.documentElement.clientHeight) +
          (el.offsetHeight - 50);
        if (bounding.bottom <= minScroll) {
          el.classList.add("vp-visible");
          this.visible = true;
          clearInterval(this.intervals[ind]);
        }
      }, 100);
    });
  },
};
