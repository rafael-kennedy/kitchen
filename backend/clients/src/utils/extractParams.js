export function makeParamsExtractor(...names) {
  return function paramsExtractor(context) {
    names.forEach((name) => {
      const value = context.params.query[name];
      delete context.params.query[name];
      if (value) {
        context.params.saved || (context.params.saved = {});
        context.params.saved[name] = value;
      }
    });
  };
}
