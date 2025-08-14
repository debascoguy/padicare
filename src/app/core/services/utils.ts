
export const toCamelCase = (str: string) => str.replace(/[-_]+(.)?/g, (match, char) => {
  return char ? char.toUpperCase() : '';
}).trim();


export function getObjectDifferences(obj1: any, obj2: any): any | undefined {
  const differences: any = {};

  // Check for properties in obj1 not in obj2, or with different values
  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        differences[key] = [obj1[key], undefined]; // Property exists in obj1 but not obj2
      } else if (typeof obj1[key] === 'object' && obj1[key] !== null &&
        typeof obj2[key] === 'object' && obj2[key] !== null) {
        const nestedDifferences = getObjectDifferences(obj1[key], obj2[key]);
        if (nestedDifferences) {
          differences[key] = nestedDifferences;
        }
      } else if (obj1[key] !== obj2[key]) {
        differences[key] = [obj1[key], obj2[key]]; // Different values
      }
    }
  }

  // Check for properties in obj2 not in obj1
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key) &&
      !Object.prototype.hasOwnProperty.call(obj1, key)) {
      differences[key] = [undefined, obj2[key]]; // Property exists in obj2 but not obj1
    }
  }

  return Object.keys(differences).length === 0 ? undefined : differences;
}

export function isObjectDifferent(obj1: any, obj2: any): boolean {
  const difference = getObjectDifferences(obj1, obj2);
  return difference != undefined;
}

export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

