export function calculateAge(dobValue: string | Date, today = new Date()) {
  const dob = dobValue instanceof Date ? dobValue : new Date(dobValue);
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthday) age -= 1;

  return age;
}
