function Slot({
  vill,
  fullAddress,
  d1Count1,
  d2Count1,
  vaxType1,
  d1Count2,
  d2Count2,
  vaxType2,
}) {
  return `<div class="slot">
  <div class="address">
    <span class="vill" id="address-vill">${vill}</span>
    <span class="full-address" id="full-address"
      >${fullAddress}</span
    >
  </div>

  <div class="dose-avail">
    <span class="age-grp">18-44 only</span>

    <div class="doses">
      <div class="dose-1">
        <span>Dose 1</span>
        <span class="d1-count" id="d1-count">${d1Count1}</span>
      </div>
      <div class="dose-2">
        <span>Dose 2</span>
        <span class="d2-count" id="d2-count">${d2Count1}</span>
      </div>
    </div>
    <span class="vax-type">${vaxType1}</span>
  </div>
  <div class="dose-avail">
    <span class="age-grp">18-44 only</span>

    <div class="doses">
      <div class="dose-1">
        <span>Dose 1</span>
        <span class="d1-count" id="d1-count">${d1Count2}</span>
      </div>
      <div class="dose-2">
        <span>Dose 2</span>
        <span class="d2-count" id="d2-count">${d2Count2}</span>
      </div>
    </div>
    <span class="vax-type">${vaxType2}</span>
  </div>
  <button class="register-btn">Register</button>
</div>`;
}

module.exports = {
  Slot,
};
