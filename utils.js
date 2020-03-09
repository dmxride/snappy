function deepParseJson(jsonString) {
  if (typeof jsonString === 'string') {
    if (!isNaN(Number(jsonString))) {
      return jsonString;
    }
    try {
      return deepParseJson(JSON.parse(jsonString));
    } catch (err) {
      return jsonString;
    }
  } else if (Array.isArray(jsonString)) {
    return jsonString.map(val => deepParseJson(val));
  } else if (typeof jsonString === 'object' && jsonString !== null) {
    return Object.keys(jsonString).reduce((obj, key) => {
      obj[key] = deepParseJson(jsonString[key]);
      return obj;
    }, {});
  } else {
    return jsonString;
  }
}

export {
  deepParseJson
}