
export function ReverseEnum(enumObject: { [key: string]: string }) {
  const reversed: { [key: string]: string } = {};
  Object.entries(enumObject).forEach(([key, value]) => {
    reversed[value] = key;
  });
  return reversed;
}
