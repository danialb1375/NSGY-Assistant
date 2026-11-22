export function calculateICHScore(age, gcs, volume, ivh, infratentorial) {
  const valid =
    Number.isInteger(age) &&
    age > 0 &&
    Number.isInteger(gcs) &&
    gcs >= 3 &&
    gcs <= 15 &&
    Number.isFinite(volume) &&
    volume > 0 &&
    typeof ivh === "boolean" &&
    typeof infratentorial === "boolean";

  if (!valid) {
    return null;
  }

  const age_point = age >= 80 ? 1 : 0;
  const vol_point = volume >= 30 ? 1 : 0;
  const ivh_point = ivh ? 1 : 0;
  const infratent_point = infratentorial ? 1 : 0;
  const gcs_point = gcs <= 4 ? 2 : gcs <= 12 ? 1 : 0;

  const score = age_point + vol_point + ivh_point + infratent_point + gcs_point;

  return {
    score,
    components: {
      gcs: gcs_point,
      age: age_point,
      volume: vol_point,
      ivh: ivh_point,
      infratentorial: infratent_point,
    },
  };
}
