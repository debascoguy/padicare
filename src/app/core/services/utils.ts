
export const toCamelCase = (str: string) => str.replace(/[-_]+(.)?/g, (match, char) => {
    return char ? char.toUpperCase() : '';
  }).trim();